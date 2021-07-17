package in.spotgarage.repository;

import com.couchbase.client.java.search.SearchQuery;
import com.couchbase.client.java.search.queries.AbstractFtsQuery;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

class CustomN1qlCouchbaseRepositoryTest {

    @MethodSource
    @ParameterizedTest
    public void queryString(String query, AbstractFtsQuery ftsQuery) {
        assertThat(CustomN1qlCouchbaseRepository.queryString(query).toString()).isEqualTo(ftsQuery.toString());
    }

    @SuppressWarnings("unused")
    private static Stream<Arguments> queryString() {
        return Stream.of(
            Arguments.of("id:A", SearchQuery.docId("A")),
            Arguments.of("id:A id:B", SearchQuery.docId("A", "B")),
            Arguments.of("hello id:A", SearchQuery.conjuncts(SearchQuery.queryString("hello"), SearchQuery.docId("A"))),
            Arguments.of("hello id:A kitty id:B", SearchQuery.conjuncts(SearchQuery.queryString("hello kitty"), SearchQuery.docId("A", "B"))),
            Arguments.of("hello kitty", SearchQuery.queryString("hello kitty"))
        );
    }
}
