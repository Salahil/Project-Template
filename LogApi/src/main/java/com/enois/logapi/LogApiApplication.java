package com.enois.logapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class LogApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(LogApiApplication.class, args);
	}

}
