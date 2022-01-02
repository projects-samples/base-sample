package in.spotgarage.cucumber;

import in.spotgarage.SpotGarageApp;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

@CucumberContextConfiguration
@SpringBootTest(classes = SpotGarageApp.class)
@WebAppConfiguration
public class CucumberTestContextConfiguration {}
