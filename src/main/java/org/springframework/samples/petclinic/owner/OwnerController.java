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

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import jakarta.validation.Valid;

import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * @author Juergen Hoeller
 * @author Ken Krebs
 * @author Arjen Poutsma
 * @author Michael Isvy
 * @author Wick Dynex
 */
@Controller
class OwnerController {

	private static final String VIEWS_OWNER_CREATE_OR_UPDATE_FORM = "owners/createOrUpdateOwnerForm";

	private final OwnerRepository owners;

	public OwnerController(OwnerRepository owners) {
		this.owners = owners;
	}

	@InitBinder
	public void setAllowedFields(WebDataBinder dataBinder) {
		dataBinder.setDisallowedFields("id");
	}

	@ModelAttribute("owner")
	public Owner findOwner(@PathVariable(name = "ownerId", required = false) Integer ownerId) {
		return ownerId == null ? new Owner()
				: this.owners.findById(ownerId)
					.orElseThrow(() -> new IllegalArgumentException("Owner not found with id: " + ownerId
							+ ". Please ensure the ID is correct " + "and the owner exists in the database."));
	}

	@GetMapping("/owners/new")
	public String initCreationForm() {
		return VIEWS_OWNER_CREATE_OR_UPDATE_FORM;
	}

	@PostMapping("/owners/new")
	public String processCreationForm(@Valid Owner owner, BindingResult result, RedirectAttributes redirectAttributes) {
		if (result.hasErrors()) {
			redirectAttributes.addFlashAttribute("error", "There was an error in creating the owner.");
			return VIEWS_OWNER_CREATE_OR_UPDATE_FORM;
		}

		this.owners.save(owner);
		redirectAttributes.addFlashAttribute("message", "New Owner Created");
		return "redirect:/owners/" + owner.getId();
	}

	@GetMapping("/owners/find")
	public String initFindForm() {
		return "owners/findOwners";
	}

	@GetMapping("/owners")
	public String processFindForm(@RequestParam(defaultValue = "1") int page, Owner owner, BindingResult result,
			Model model) {
		// Extract search parameters
		String lastName = owner.getLastName();
		String city = owner.getCity();
		String telephone = owner.getTelephone();

		// Sanitize telephone input (strip non-numeric characters)
		if (telephone != null && !telephone.isEmpty()) {
			telephone = sanitizeTelephone(telephone);
			owner.setTelephone(telephone); // Update owner object with sanitized value
		}

		// Validate telephone (minimum 3 digits if provided)
		if (telephone != null && !telephone.isEmpty() && telephone.length() < 3) {
			result.rejectValue("telephone", "tooShort", "must be at least 3 digits");
			return "owners/findOwners";
		}

		// Validate city (minimum 2 characters if provided)
		if (city != null && !city.isEmpty() && city.length() < 2) {
			result.rejectValue("city", "tooShort", "must be at least 2 characters");
			return "owners/findOwners";
		}

		// Normalize empty strings to null for cleaner logic
		if (lastName != null && lastName.isEmpty()) {
			lastName = null;
		}
		if (city != null && city.isEmpty()) {
			city = null;
		}
		if (telephone != null && telephone.isEmpty()) {
			telephone = null;
		}

		// Search based on which fields are provided
		Page<Owner> ownersResults = findOwnersBySearchCriteria(page, lastName, city, telephone);

		if (ownersResults.isEmpty()) {
			// no owners found - build descriptive message
			String searchCriteria = buildSearchCriteriaMessage(lastName, city, telephone);
			result.rejectValue("lastName", "notFound", searchCriteria.isEmpty() ? "not found" : searchCriteria);
			return "owners/findOwners";
		}

		if (ownersResults.getTotalElements() == 1) {
			// 1 owner found - redirect to details
			owner = ownersResults.iterator().next();
			return "redirect:/owners/" + owner.getId();
		}

		// multiple owners found
		return addPaginationModel(page, model, ownersResults);
	}

	private String sanitizeTelephone(String telephone) {
		// Strip all non-numeric characters
		return telephone.replaceAll("[^0-9]", "");
	}

	private String buildSearchCriteriaMessage(String lastName, String city, String telephone) {
		StringBuilder message = new StringBuilder();
		if (lastName != null || city != null || telephone != null) {
			message.append("not found matching: ");
			boolean first = true;
			if (lastName != null) {
				message.append("lastName='").append(lastName).append("'");
				first = false;
			}
			if (city != null) {
				if (!first)
					message.append(", ");
				message.append("city='").append(city).append("'");
				first = false;
			}
			if (telephone != null) {
				if (!first)
					message.append(", ");
				message.append("telephone='").append(telephone).append("'");
			}
		}
		return message.toString();
	}

	private Page<Owner> findOwnersBySearchCriteria(int page, String lastName, String city, String telephone) {
		int pageSize = 5;
		Pageable pageable = PageRequest.of(page - 1, pageSize);

		// Determine which repository method to call based on filled fields
		if (lastName != null && city != null && telephone != null) {
			// All three fields
			return owners.findByLastNameStartingWithAndCityStartingWithIgnoreCaseAndTelephoneStartingWith(lastName,
					city, telephone, pageable);
		}
		else if (lastName != null && city != null) {
			// lastName + city
			return owners.findByLastNameStartingWithAndCityStartingWithIgnoreCase(lastName, city, pageable);
		}
		else if (lastName != null && telephone != null) {
			// lastName + telephone
			return owners.findByLastNameStartingWithAndTelephoneStartingWith(lastName, telephone, pageable);
		}
		else if (lastName != null) {
			// lastName only
			return owners.findByLastNameStartingWith(lastName, pageable);
		}
		else if (city != null) {
			// city only
			return owners.findByCityStartingWithIgnoreCase(city, pageable);
		}
		else if (telephone != null) {
			// telephone only
			return owners.findByTelephoneStartingWith(telephone, pageable);
		}
		else {
			// no criteria - return all (empty string search)
			return owners.findByLastNameStartingWith("", pageable);
		}
	}

	private String addPaginationModel(int page, Model model, Page<Owner> paginated) {
		List<Owner> listOwners = paginated.getContent();
		model.addAttribute("currentPage", page);
		model.addAttribute("totalPages", paginated.getTotalPages());
		model.addAttribute("totalItems", paginated.getTotalElements());
		model.addAttribute("listOwners", listOwners);
		return "owners/ownersList";
	}

	@GetMapping("/owners/{ownerId}/edit")
	public String initUpdateOwnerForm() {
		return VIEWS_OWNER_CREATE_OR_UPDATE_FORM;
	}

	@PostMapping("/owners/{ownerId}/edit")
	public String processUpdateOwnerForm(@Valid Owner owner, BindingResult result, @PathVariable("ownerId") int ownerId,
			RedirectAttributes redirectAttributes) {
		if (result.hasErrors()) {
			redirectAttributes.addFlashAttribute("error", "There was an error in updating the owner.");
			return VIEWS_OWNER_CREATE_OR_UPDATE_FORM;
		}

		if (!Objects.equals(owner.getId(), ownerId)) {
			result.rejectValue("id", "mismatch", "The owner ID in the form does not match the URL.");
			redirectAttributes.addFlashAttribute("error", "Owner ID mismatch. Please try again.");
			return "redirect:/owners/{ownerId}/edit";
		}

		owner.setId(ownerId);
		this.owners.save(owner);
		redirectAttributes.addFlashAttribute("message", "Owner Values Updated");
		return "redirect:/owners/{ownerId}";
	}

	/**
	 * Custom handler for displaying an owner.
	 * @param ownerId the ID of the owner to display
	 * @return a ModelMap with the model attributes for the view
	 */
	@GetMapping("/owners/{ownerId}")
	public ModelAndView showOwner(@PathVariable("ownerId") int ownerId) {
		ModelAndView mav = new ModelAndView("owners/ownerDetails");
		Optional<Owner> optionalOwner = this.owners.findById(ownerId);
		Owner owner = optionalOwner.orElseThrow(() -> new IllegalArgumentException(
				"Owner not found with id: " + ownerId + ". Please ensure the ID is correct "));
		mav.addObject(owner);
		return mav;
	}

}
