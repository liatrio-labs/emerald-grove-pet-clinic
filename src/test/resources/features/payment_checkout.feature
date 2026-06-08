Feature: Payment Checkout (EGPC-2)

  # From AC-1: Checkout form displays visit summary
  Scenario: Customer sees visit summary before paying
    Given a completed visit for "Max" with Dr. Carter
    And the visit total is $90.00
    When the owner views the payment page
    Then they see the visit summary with line items
    And the total amount is displayed

  # From AC-2: Idempotency prevents duplicate charges
  Scenario: Retry prevents duplicate charge
    Given a payment is being processed for visit 3
    When the payment times out and retries
    Then the same idempotency key is used
    And only one charge is created

  # From AC-3: PCI-DSS audit logging
  Scenario: Every payment attempt is audit logged
    Given any payment attempt
    When the payment is processed
    Then an audit log entry is created with transaction ID and timestamp

  # From AC-4: Accessible status messages
  Scenario: Payment status is screen-reader accessible
    Given a payment is processing
    Then the status message uses aria-live="polite"
    And the progress indicator is keyboard-accessible
