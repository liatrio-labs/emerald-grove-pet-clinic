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
package org.springframework.samples.petclinic.vet;

import java.util.Arrays;
import java.util.List;

import jakarta.servlet.http.HttpSession;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author Juergen Hoeller
 * @author Mark Fisher
 * @author Ken Krebs
 * @author Arjen Poutsma
 */
@Controller
class VetController {

	private final VetRepository vetRepository;

	public VetController(VetRepository vetRepository) {
		this.vetRepository = vetRepository;
	}

	@GetMapping("/vets.html")
	public String showVetList(@RequestParam(defaultValue = "1") int page, @RequestParam(required = false) String filter,
			HttpSession session, Model model) {
		// Retrieve filter from session if no query parameter provided (session
		// persistence)
		if (filter == null) {
			filter = (String) session.getAttribute("vetFilter");
		}

		// Store filter in session when present (query parameters override session state)
		if (filter != null) {
			session.setAttribute("vetFilter", filter);
		}

		// Here we are returning an object of type 'Vets' rather than a collection of Vet
		// objects so it is simpler for Object-Xml mapping
		Vets vets = new Vets();
		Page<Vet> paginated = findPaginated(page, filter);
		vets.getVetList().addAll(paginated.toList());

		// Add filter state to model for visual feedback
		if (filter != null && filter.startsWith("specialty:")) {
			String specialtyName = filter.substring("specialty:".length());
			model.addAttribute("filterActive", true);
			model.addAttribute("filterText", specialtyName);
		}

		// Pass current filter to template for dropdown selection state
		model.addAttribute("currentFilter", filter);

		return addPaginationModel(page, paginated, model);
	}

	private String addPaginationModel(int page, Page<Vet> paginated, Model model) {
		List<Vet> listVets = paginated.getContent();
		model.addAttribute("currentPage", page);
		model.addAttribute("totalPages", paginated.getTotalPages());
		model.addAttribute("totalItems", paginated.getTotalElements());
		model.addAttribute("listVets", listVets);
		return "vets/vetList";
	}

	private Page<Vet> findPaginated(int page, String filter) {
		int pageSize = 5;
		Pageable pageable = PageRequest.of(page - 1, pageSize);

		// Parse filter and apply specialty filtering
		if (filter != null && filter.startsWith("specialty:")) {
			String specialtyNames = filter.substring("specialty:".length());

			// Check if multiple specialties (comma-separated) - requires AND logic
			if (specialtyNames.contains(",")) {
				List<String> specialtyList = Arrays.asList(specialtyNames.split(","));
				return vetRepository.findByAllSpecialties(specialtyList, (long) specialtyList.size(), pageable);
			}
			else {
				// Single specialty filtering
				return vetRepository.findBySpecialtiesNameIgnoreCase(specialtyNames, pageable);
			}
		}

		return vetRepository.findAll(pageable);
	}

	@GetMapping({ "/vets" })
	public @ResponseBody Vets showResourcesVetList() {
		// Here we are returning an object of type 'Vets' rather than a collection of Vet
		// objects so it is simpler for JSon/Object mapping
		Vets vets = new Vets();
		vets.getVetList().addAll(this.vetRepository.findAll());
		return vets;
	}

}
