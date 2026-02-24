# Upkart .NET Backend – Structure vs Spring Boot

This document briefly maps this ASP.NET Core Web API structure to the **esports-backend** (Spring Boot) layout so you can relate both backends.

---

## 1. Entry point & configuration

| Spring Boot (esports-backend) | ASP.NET Core (Upkart1) |
|------------------------------|-------------------------|
| `EsportsBackendApplication.java` + `@SpringBootApplication` | `Program.cs` (entry + pipeline) |
| `application.properties` | `appsettings.json` / `appsettings.Development.json` |
| Component scan + auto-config | `AddApplicationDbContext`, `AddApplicationServices`, `AddJwtAuthentication`, etc. in `Extensions/ServiceCollectionExtensions.cs` |

`Program.cs` wires **DI**, **middleware**, **controllers**, and **SignalR**; extension methods group registration (similar to Spring `@Configuration` classes).

---

## 2. Layered architecture

| Layer | Spring Boot | ASP.NET Core (this project) |
|-------|--------------|-----------------------------|
| **Controller** | `@RestController` + `@RequestMapping` (e.g. `AuthController.java`) | `Controllers/` – classes with `[ApiController]` + `[Route("api/...")]` |
| **Service** | `@Service` (e.g. `UserService.java`) | `Services/` – interfaces (`IUserService`) + implementations (`UserService`) |
| **Repository** | `@Repository` / JpaRepository (e.g. `UserRepository.java`) | `repository/` – interfaces + implementations; many services use `ApplicationDbContext` directly (like using `EntityManager` in Spring) |
| **Model / Entity** | `entity/` (e.g. `User.java`, `Project.java`) | `Entities/` – same domain entities |
| **DTO** | `dto/` (e.g. `AuthResponse.java`) | `DTO/` – request/response models |

So: **Controller → Service → DbContext/Repository → Entity** in .NET matches **Controller → Service → Repository/JPA → Entity** in Spring.

---

## 3. Dependency injection

| Spring Boot | ASP.NET Core |
|-------------|--------------|
| `@Autowired` (constructor injection) | Constructor injection by default – add interfaces/services in DI, inject in controller/service constructors |
| `@Configuration` + `@Bean` (e.g. `SecurityConfig`, `WebConfig`) | `Extensions/ServiceCollectionExtensions.cs` – `AddApplicationDbContext`, `AddApplicationServices`, `AddJwtAuthentication`, `AddCorsPolicy`, `AddSwaggerDocumentation` |
| `@Service`, `@Repository` (component scan) | Explicit `AddScoped<IX, X>()` in `AddApplicationServices()` |

No `@Autowired` attribute is needed in .NET; registering in `ServiceCollection` and injecting via constructor is the equivalent.

---

## 4. Middleware vs filter chain

| Spring Boot | ASP.NET Core |
|-------------|--------------|
| `SecurityConfig` – `SecurityFilterChain`, CORS, JWT filter | `UseCors()` → `UseAuthentication()` → `JwtAuthenticationMiddleware` → `UseAuthorization()` in `Program.cs` |
| `WebConfig` – CORS, resource handlers | CORS and static files configured in `Program.cs` / extension methods |
| `JwtAuthenticationFilter` (before `UsernamePasswordAuthenticationFilter`) | `JwtAuthenticationMiddleware` (after `UseAuthentication()`) |

Order in `Program.cs`: **CORS → Authentication → JWT middleware → Authorization → MapControllers / MapHub**.

---

## 5. Controllers & routing

| Spring Boot | ASP.NET Core |
|-------------|--------------|
| `@RestController` + `@RequestMapping("/api/auth")` | `[ApiController]` + `[Route("api/auth")]` |
| `@PostMapping("/register")` | `[HttpPost("register")]` |
| `ResponseEntity<?>` | `IActionResult` / `Ok()`, `BadRequest()`, etc. |
| `@Valid @RequestBody RegisterRequest` | `[FromBody] RegisterRequest` (validation via DataAnnotations or FluentValidation) |

Same idea: HTTP verb + route + body/query binding.

---

## 6. Swagger

| Spring Boot | ASP.NET Core |
|-------------|--------------|
| Springdoc / Swagger dependency + config | `AddSwaggerDocumentation()` (in `ServiceCollectionExtensions`) – Swagger doc + Bearer JWT scheme |
| Swagger UI at `/swagger-ui.html` | Swagger UI via `UseSwagger()` + `UseSwaggerUI()` (e.g. `/swagger`) |

Used the same way for API discovery and testing.

---

## 7. Summary

- **Program.cs** = main entry + middleware pipeline (like `SpringApplication.run` + filter chain + dispatcher).
- **Extensions/ServiceCollectionExtensions.cs** = central DI and app config (like Spring `@Configuration` + `@Bean`).
- **Controllers** = `@RestController`.
- **Services** = `@Service` (with interfaces for DI).
- **Entities** = JPA-style entities; **DTO** = request/response objects.
- **DbContext** = data access (similar to JPA `EntityManager` / Data Source); repositories are optional and used where you added them.

Your existing project logic and folder layout (Controllers, Services, Entities, DTO, repository, Data, Security) are unchanged; only **Program.cs** and the new **Extensions** (and this doc) were added or adjusted to align with this structure.
