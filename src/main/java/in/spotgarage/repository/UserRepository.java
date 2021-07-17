package in.spotgarage.repository;

import in.spotgarage.domain.User;

import in.spotgarage.repository.search.SearchCouchbaseRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.time.Instant;

import static in.spotgarage.config.Constants.ID_DELIMITER;

/**
 * Spring Data Couchbase repository for the {@link User} entity.
 */
@Repository
public interface UserRepository extends N1qlCouchbaseRepository<User, String>, SearchCouchbaseRepository<User, String> {

    String USERS_BY_LOGIN_CACHE = "usersByLogin";

    String USERS_BY_EMAIL_CACHE = "usersByEmail";

    Optional<User> findOneByActivationKey(String activationKey);

    List<User> findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedDateBefore(Instant dateTime);

    Optional<User> findOneByResetKey(String resetKey);

    @Cacheable(cacheNames = USERS_BY_EMAIL_CACHE)
    Optional<User> findOneByEmailIgnoreCase(String email);

    @Cacheable(cacheNames = USERS_BY_LOGIN_CACHE)
    default Optional<User> findOneByLogin(String login) {
        return findById(User.PREFIX + ID_DELIMITER + login);
    }

    Page<User> findAllByLoginNot(Pageable pageable, String login);
}
