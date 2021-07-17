package in.spotgarage.cucumber;

import org.junit.runner.RunWith;

import in.spotgarage.AbstractNeo4jIT;
import io.cucumber.junit.CucumberOptions;
import io.cucumber.junit.Cucumber;

@RunWith(Cucumber.class)
@CucumberOptions(plugin = "pretty", features = "src/test/features")
@ExtendWith(AbstractNeo4jIT) 
public class CucumberIT  {

}
