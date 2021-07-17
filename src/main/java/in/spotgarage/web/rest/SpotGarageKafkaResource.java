package in.spotgarage.web.rest;

import in.spotgarage.service.SpotGarageKafkaProducer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/spot-garage-kafka")
public class SpotGarageKafkaResource {

    private final Logger log = LoggerFactory.getLogger(SpotGarageKafkaResource.class);

    private SpotGarageKafkaProducer kafkaProducer;

    public SpotGarageKafkaResource(SpotGarageKafkaProducer kafkaProducer) {
        this.kafkaProducer = kafkaProducer;
    }

    @PostMapping("/publish")
    public void sendMessageToKafkaTopic(@RequestParam("message") String message) {
        log.debug("REST request to send to Kafka topic the message : {}", message);
        this.kafkaProducer.send(message);
    }
}
