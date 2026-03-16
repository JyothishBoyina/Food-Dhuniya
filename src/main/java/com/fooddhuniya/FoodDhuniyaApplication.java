package com.fooddhuniya;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class FoodDhuniyaApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodDhuniyaApplication.class, args);
	}
}
