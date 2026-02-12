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

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Repository class for {@link Visit} domain objects. Provides query methods for
 * retrieving upcoming visits with associated pet and owner information.
 */
public interface VisitRepository extends JpaRepository<Visit, Integer> {

	/**
	 * Retrieve upcoming visits between the specified dates, ordered by visit date
	 * ascending. Uses a native SQL query to join visits with pets and owners since the
	 * Visit entity does not have a direct JPA relationship to Pet.
	 * @param startDate the start of the date range (inclusive)
	 * @param endDate the end of the date range (inclusive)
	 * @return a list of {@link UpcomingVisitDTO} objects containing visit, pet, and owner
	 * information
	 */
	@Query(nativeQuery = true,
			value = "SELECT v.visit_date AS visitDate, " + "CONCAT(o.first_name, ' ', o.last_name) AS ownerName, "
					+ "p.name AS petName, " + "v.description AS description " + "FROM visits v "
					+ "JOIN pets p ON v.pet_id = p.id " + "JOIN owners o ON p.owner_id = o.id "
					+ "WHERE v.visit_date >= :startDate AND v.visit_date <= :endDate " + "ORDER BY v.visit_date ASC")
	List<UpcomingVisitDTO> findUpcomingVisits(@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate);

}
