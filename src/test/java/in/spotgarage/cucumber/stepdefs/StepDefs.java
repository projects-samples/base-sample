package in.spotgarage.cucumber.stepdefs;

import in.spotgarage.SpotGarageApp;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.ResultActions;

import org.springframework.boot.test.context.SpringBootTest;

@WebAppConfiguration
@SpringBootTest
@ContextConfiguration(classes = SpotGarageApp.class)
public abstract class StepDefs {

    protected ResultActions actions;

}
