package in.spotgarage.config;

import io.github.jhipster.config.JHipsterConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.neo4j.springframework.data.repository.config.EnableNeo4jRepositories;
import org.neo4j.springframework.data.repository.Neo4jRepository;


@Configuration
@EnableNeo4jRepositories(basePackages = "in.spotgarage.repository", includeFilters = @Filter(type = FilterType.ASSIGNABLE_TYPE, value = Neo4jRepository.class))
@EnableElasticsearchRepositories("in.spotgarage.repository.search")
public class DatabaseConfiguration {

    private final Logger log = LoggerFactory.getLogger(DatabaseConfiguration.class);
}
