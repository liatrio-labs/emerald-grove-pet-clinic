/*
 * Copyright 2012-2025 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.springframework.samples.petclinic.owner;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.restclient.RestTemplateBuilder;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

/**
 * Integration tests for the upcoming visits page using a full Spring Boot application
 * context with a random port.
 */
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class UpcomingVisitsIntegrationTests {

	@LocalServerPort
	int port;

	@Autowired
	private RestTemplateBuilder builder;

	@Test
	void testUpcomingVisitsPageReturnsOk() {
		RestTemplate template = builder.rootUri("http://localhost:" + port).build();
		ResponseEntity<String> result = template.exchange(RequestEntity.get("/visits/upcoming").build(), String.class);
		assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
	}

	@Test
	void testUpcomingVisitsPageContainsTableStructure() {
		RestTemplate template = builder.rootUri("http://localhost:" + port).build();
		ResponseEntity<String> result = template.exchange(RequestEntity.get("/visits/upcoming").build(), String.class);
		assertThat(result.getBody()).contains("upcoming-visits");
		assertThat(result.getBody()).contains("Upcoming Visits");
	}

	@Test
	void testUpcomingVisitsWithDaysParameter() {
		RestTemplate template = builder.rootUri("http://localhost:" + port).build();
		ResponseEntity<String> result = template
			.exchange(RequestEntity.get("/visits/upcoming?days=14").build(), String.class);
		assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(result.getBody()).contains("14");
	}

	@Test
	void testUpcomingVisitsWithFilterButtons() {
		RestTemplate template = builder.rootUri("http://localhost:" + port).build();
		ResponseEntity<String> result = template.exchange(RequestEntity.get("/visits/upcoming").build(), String.class);
		assertThat(result.getBody()).contains("days=3");
		assertThat(result.getBody()).contains("days=7");
		assertThat(result.getBody()).contains("days=14");
		assertThat(result.getBody()).contains("days=30");
	}

}
