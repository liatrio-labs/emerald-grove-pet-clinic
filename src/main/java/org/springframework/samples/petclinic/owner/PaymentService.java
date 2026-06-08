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
import java.time.LocalDateTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Stub payment service for the checkout prototype.
 *
 * NOTE: This is a spike/prototype (EGPC-2). Not production-ready.
 * Missing: real payment gateway, retry logic, circuit breaker, audit trail.
 */
@Service
public class PaymentService {

	private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

	/**
	 * Process a payment for a visit. Currently a stub that always returns success.
	 * @param visitId the visit to pay for
	 * @param amount the payment amount
	 * @param idempotencyKey client-generated key to prevent duplicate charges
	 * @return a Payment object with status set to SUCCESS
	 */
	public Payment processPayment(Integer visitId, BigDecimal amount, String idempotencyKey) {
		log.info("Processing payment for visit {} amount {} idempotencyKey {}", visitId, amount, idempotencyKey);

		Payment payment = new Payment();
		payment.setVisitId(visitId);
		payment.setAmount(amount);
		payment.setIdempotencyKey(idempotencyKey);
		payment.setPaymentDate(LocalDateTime.now());
		payment.setStatus("SUCCESS");

		log.info("Payment completed: status={} transactionId={}", payment.getStatus(), UUID.randomUUID());
		return payment;
	}

}
