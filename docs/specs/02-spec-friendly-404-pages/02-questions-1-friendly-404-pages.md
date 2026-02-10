# 02 Questions Round 1 - Friendly 404 Pages

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. Error Message Content

What level of detail should the 404 error messages provide to users?

- [x] (A) Minimal - Just say "Owner not found" or "Pet not found" without any additional context
- [ ] (B) Helpful - Include the ID that was requested and suggest next steps (e.g., "Owner #123 not found. Please check the ID or search for owners.")
- [ ] (C) Detailed - Include the ID, explain what might have caused the issue, and provide multiple navigation options
- [ ] (D) Branded - Match the current error page style with pet-themed messaging (e.g., "Oops! This owner seems to have wandered off...")
- [ ] (E) Other (describe)

## 2. Navigation Options

What navigation options should be available on the 404 error page?

- [ ] (A) Only "Find Owners" link (as specified in acceptance criteria)
- [x] (B) "Find Owners" + "Home" link
- [ ] (C) "Find Owners" + "Home" + "Back to previous page" button
- [ ] (D) Full navigation breadcrumb trail
- [ ] (E) Other (describe)

## 3. Pet-Specific 404 Handling

When a pet is not found for an owner (e.g., `/owners/1/pets/999`), what should happen?

- [x] (A) Show same 404 page as missing owner with generic "Pet not found" message
- [ ] (B) Show 404 page that mentions both the owner ID and pet ID (e.g., "Pet #999 not found for Owner #1")
- [ ] (C) Show 404 page with link back to the owner's detail page (since we know the owner exists)
- [ ] (D) Show different error page specifically for missing pets vs missing owners
- [ ] (E) Other (describe)

## 4. Exception Handling Approach

How should we implement the 404 error handling technically?

- [ ] (A) Create a custom `ResourceNotFoundException` and throw it from controllers, handle with @ControllerAdvice
- [x] (B) Use Spring's ResponseStatusException with NOT_FOUND status in controllers
- [ ] (C) Return ModelAndView with error view and 404 status directly from controller methods
- [ ] (D) Create a custom @ExceptionHandler in each controller
- [ ] (E) Other (describe)

## 5. Scope of 404 Handling

Should this 404 handling extend beyond owners and pets?

- [x] (A) Only owners and pets (as specified)
- [ ] (B) Also include visits (e.g., `/owners/1/pets/2/visits/999`)
- [ ] (C) Also include veterinarians (e.g., `/vets/999`)
- [ ] (D) Create a general 404 handler for all missing resources in the application
- [ ] (E) Other (describe)

## 6. Error Template Strategy

Should we create a new template or modify the existing error.html?

- [x] (A) Modify existing `error.html` to add the "Find Owners" link and improve messaging
- [ ] (B) Create a new `404.html` template specifically for not-found errors
- [ ] (C) Create separate templates for different resource types (owner-not-found.html, pet-not-found.html)
- [ ] (D) Create a reusable error fragment that can be customized per resource type
- [ ] (E) Other (describe)

## 7. Logging and Monitoring

How should 404 errors be logged for debugging and monitoring?

- [x] (A) No special logging - let Spring Boot's default logging handle it
- [ ] (B) Log at WARN level with the requested URL and resource ID
- [ ] (C) Log at INFO level (since 404s are not necessarily errors, could be user typos)
- [ ] (D) Log at DEBUG level only - don't clutter logs with expected 404s
- [ ] (E) Other (describe)

## 8. Backward Compatibility

Are there any existing bookmarks, links, or integrations that rely on current error behavior?

- [x] (A) No concerns - this is a new implementation, no backward compatibility needed
- [ ] (B) Yes, external monitoring tools expect certain error formats
- [ ] (C) Yes, there may be direct links to owner/pet URLs that need to continue working
- [ ] (D) Unsure - need to investigate before implementing
- [ ] (E) Other (describe)
