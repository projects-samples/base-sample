package in.spotgarage.repository;

import in.spotgarage.domain.PersistentToken;
import in.spotgarage.domain.User;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static in.spotgarage.config.Constants.ID_DELIMITER;

/**
 * Spring Data Couchbase repository for the {@link PersistentToken} entity.
 */
public interface PersistentTokenRepository extends N1qlCouchbaseRepository<PersistentToken, String> {

    default Optional<PersistentToken> findBySeries(String series) {
        return findById(PersistentToken.PREFIX + ID_DELIMITER + series);
    }

    default void deleteBySeries(String series) {
        deleteById(PersistentToken.PREFIX + ID_DELIMITER + series);
    }

    default List<PersistentToken> findByUser(User user) {
        return findByLogin(user.getLogin());
    }

    List<PersistentToken> findByLogin(String login);

    List<PersistentToken> findByTokenDateBefore(LocalDate localDate);

}
