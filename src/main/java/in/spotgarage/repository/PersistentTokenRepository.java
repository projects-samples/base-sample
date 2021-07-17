package in.spotgarage.repository;

import com.datastax.driver.core.*;
import com.datastax.driver.mapping.Mapper;
import com.datastax.driver.mapping.MappingManager;
import in.spotgarage.domain.PersistentToken;
import in.spotgarage.domain.User;
import org.springframework.stereotype.Repository;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Validator;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Cassandra repository for the {@link PersistentToken} entity.
 */
@Repository
public class PersistentTokenRepository {

    private final Session session;

    private final Validator validator;

    Mapper<PersistentToken> mapper;

    private PreparedStatement findPersistentTokenSeriesByUserIdStmt;

    private PreparedStatement insertPersistentTokenSeriesByUserIdStmt;

    private PreparedStatement insertPersistentTokenStmt;

    private PreparedStatement deletePersistentTokenSeriesByUserIdStmt;

    public PersistentTokenRepository(Session session, Validator validator) {
        this.session = session;
        this.validator = validator;
        mapper = new MappingManager(session).mapper(PersistentToken.class);

        findPersistentTokenSeriesByUserIdStmt = session.prepare(
            "SELECT persistent_token_series " +
            "FROM persistent_token_by_user " +
            "WHERE user_id = :user_id");

        insertPersistentTokenSeriesByUserIdStmt = session.prepare(
            "INSERT INTO persistent_token_by_user (user_id, persistent_token_series) " +
                "VALUES (:user_id, :persistent_token_series) " +
                "USING TTL 2592000"); // 30 days

        insertPersistentTokenStmt = session.prepare(
            "INSERT INTO persistent_token (series, token_date, user_agent, token_value, login, user_id, ip_address) " +
                "VALUES (:series, :token_date, :user_agent, :token_value, :login, :user_id, :ip_address) " +
                "USING TTL 2592000"); // 30 days

        deletePersistentTokenSeriesByUserIdStmt = session.prepare(
            "DELETE FROM persistent_token_by_user WHERE user_id = :user_id AND persistent_token_series = :persistent_token_series"
        );
    }

    public Optional<PersistentToken> findById(String presentedSeries) {
        return Optional.ofNullable(mapper.get(presentedSeries));
    }

    public List<PersistentToken> findByUser(User user) {
        BoundStatement stmt = findPersistentTokenSeriesByUserIdStmt.bind();
        stmt.setString("user_id", user.getId());
        ResultSet rs = session.execute(stmt);
        List<PersistentToken> persistentTokens = new ArrayList<>();
        rs.all().stream()
            .map(row -> row.getString("persistent_token_series"))
            .map(token -> mapper.get(token))
            .forEach(persistentTokens::add);

        return persistentTokens;
    }

    public void save(PersistentToken token) {
        Set<ConstraintViolation<PersistentToken>> violations = validator.validate(token);
        if (violations != null && !violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
        BatchStatement batch = new BatchStatement();
        batch.add(insertPersistentTokenStmt.bind()
            .setString("series", token.getSeries())
            .setTimestamp("token_date", token.getTokenDate())
            .setString("user_agent", token.getUserAgent())
            .setString("token_value", token.getTokenValue())
            .setString("login", token.getLogin())
            .setString("user_id", token.getUserId())
            .setString("ip_address", token.getIpAddress()));
        batch.add(insertPersistentTokenSeriesByUserIdStmt.bind()
            .setString("user_id", token.getUserId())
            .setString("persistent_token_series", token.getSeries()));
        session.execute(batch);
    }

    public void delete(PersistentToken token) {
        mapper.delete(token);
        session.execute(deletePersistentTokenSeriesByUserIdStmt.bind()
            .setString("user_id", token.getUserId())
            .setString("persistent_token_series", token.getSeries()));
    }
}
