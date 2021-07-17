package in.spotgarage.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class SpotGarageKafkaConsumer {

    private final Logger log = LoggerFactory.getLogger(SpotGarageKafkaConsumer.class);
    private static final String TOPIC = "topic_spotgarage";

    @KafkaListener(topics = "topic_spotgarage", groupId = "group_id")
    public void consume(String message) throws IOException {
        log.info("Consumed message in {} : {}", TOPIC, message);
    }
}
