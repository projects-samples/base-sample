package in.spotgarage.repository;

import com.couchbase.client.java.search.SearchQuery;
import com.couchbase.client.java.search.queries.AbstractFtsQuery;
import com.couchbase.client.java.search.queries.DocIdQuery;
import com.couchbase.client.java.search.queries.QueryStringQuery;
import com.couchbase.client.java.search.result.SearchQueryResult;
import com.couchbase.client.java.search.result.SearchQueryRow;
import in.spotgarage.repository.search.SearchCouchbaseRepository;
import org.springframework.data.couchbase.core.CouchbaseOperations;
import org.springframework.data.couchbase.core.mapping.CouchbasePersistentEntity;
import org.springframework.data.couchbase.repository.query.CouchbaseEntityInformation;
import org.springframework.data.couchbase.repository.support.N1qlCouchbaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * A custom implementation of {@code CouchbaseRepository}.
 */
public class CustomN1qlCouchbaseRepository<T, ID extends Serializable> extends N1qlCouchbaseRepository<T, ID> implements SearchCouchbaseRepository<T, ID> {

    private final CouchbasePersistentEntity<?> persistentEntity;

    /**
     * Create a new Repository.
     *
     * @param metadata            the Metadata for the entity.
     * @param couchbaseOperations the reference to the template used.
     */
    public CustomN1qlCouchbaseRepository(CouchbaseEntityInformation<T, String> metadata, CouchbaseOperations couchbaseOperations) {
        super(metadata, couchbaseOperations);
        persistentEntity = getCouchbaseOperations().getConverter().getMappingContext().getPersistentEntity(getEntityInformation().getJavaType());
    }

    @Override
    public <S extends T> S save(S entity) {
        return super.save(populateIdIfNecessary(entity));
    }

    public Page<T> search(String indexName, String request, Pageable pageable) {
        SearchQuery searchQuery = new SearchQuery(indexName, queryString(request))
            .limit(pageable.getPageSize())
            .skip((int) pageable.getOffset());
        SearchQueryResult result = getCouchbaseOperations().getCouchbaseBucket().query(searchQuery);
        List<T> pageContent = extractResults(result);
        return new PageImpl<>(pageContent, pageable, result.metrics().totalHits());
    }

    @Override
    public List<T> search(String indexName, String request) {
        SearchQuery searchQuery = new SearchQuery(indexName, queryString(request));
        return extractResults(getCouchbaseOperations().getCouchbaseBucket().query(searchQuery));
    }

    static AbstractFtsQuery queryString(String request) {
        List<String> ids = new LinkedList<>();
        for (String r : request.split(" ")) {
            if (r.indexOf("id:") == 0) {
                ids.add(r.substring(3));
                request = request.replace(r, "").replaceAll("[ ]+", " ").trim();
            }
        }
        QueryStringQuery queryString = SearchQuery.queryString(request);
        if (ids.size() != 0) {
            DocIdQuery docIdQuery = SearchQuery.docId(ids.toArray(new String[0]));
            if (!request.isEmpty()) {
                return SearchQuery.conjuncts(queryString, docIdQuery);
            }
            return docIdQuery;
        }
        return queryString;
    }

    @SuppressWarnings("unchecked")
    private List<T> extractResults(SearchQueryResult result) {
        return result.hits().stream()
            .map(SearchQueryRow::id)
            .map(id -> (ID) id)
            .map(this::findById)
            .filter(Optional::isPresent)
            .map(Optional::get)
            .collect(Collectors.toList());
    }

    /**
     * Add generated ID to entity if not already set.
     *
     * @param entity the entity to update.
     * @return entity with ID set.
     */
    private <S extends T> S populateIdIfNecessary(S entity) {
        if (getEntityInformation().getId(entity) != null) {
            return entity;
        }
        setId(entity, getCouchbaseOperations().getGeneratedId(entity));
        return entity;
    }

    private <S extends T> void setId(S entity, String generatedId) {
        persistentEntity.getPropertyAccessor(entity).setProperty(persistentEntity.getIdProperty(), generatedId);
    }
}
