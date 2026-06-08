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

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Controller for the payment checkout prototype.
 *
 * NOTE: This is a spike/prototype (EGPC-2). Not production-ready. Missing: POST handler,
 * CSRF, input validation, error handling.
 */
@Controller
class PaymentController {

	private final OwnerRepository owners;

	private final PaymentService paymentService;

	PaymentController(OwnerRepository owners, PaymentService paymentService) {
		this.owners = owners;
		this.paymentService = paymentService;
	}

	@GetMapping("/owners/{ownerId}/visits/{visitId}/pay")
	public String showCheckoutForm(@PathVariable int ownerId, @PathVariable int visitId, Model model) {
		Owner owner = owners.findById(ownerId)
			.orElseThrow(() -> new IllegalArgumentException("Owner not found with id: " + ownerId));

		model.addAttribute("owner", owner);
		model.addAttribute("visitId", visitId);
		model.addAttribute("idempotencyKey", UUID.randomUUID().toString());

		// Stub data for the prototype display
		model.addAttribute("petName", "Buddy");
		model.addAttribute("vetName", "Dr. Carter");
		model.addAttribute("visitDate", "2026-06-05");
		model.addAttribute("visitDescription", "Annual checkup and vaccinations");
		model.addAttribute("amount", new BigDecimal("90.00"));

		return "owners/paymentCheckout";
	}

}
