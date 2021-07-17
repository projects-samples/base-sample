package in.spotgarage.repository;

import in.spotgarage.domain.PersistentToken;
import in.spotgarage.domain.User;
import java.time.LocalDate;import org.neo4j.springframework.data.repository.Neo4jRepository;

import java.util.List;


public interface PersistentTokenRepository extends Neo4jRepository<PersistentToken, String> {

    List<PersistentToken> findByUser(User user);

    List<PersistentToken> findByTokenDateBefore(LocalDate localDate);

}
