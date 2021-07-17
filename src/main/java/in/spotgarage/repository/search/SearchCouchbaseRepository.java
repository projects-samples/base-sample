package in.spotgarage.repository.search;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Full Text Search Couchbase repository.
 */
public interface SearchCouchbaseRepository<T, ID> {

    Page<T> search(String indexName, String request, Pageable pageable);

    List<T> search(String indexName, String request);
}
