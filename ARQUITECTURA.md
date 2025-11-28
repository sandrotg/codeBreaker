# Arquitectura de CodeBreaker

## Descripción General

**CodeBreaker** es una plataforma de evaluación de código que permite a los instructores crear desafíos de programación, gestionar cursos, realizar evaluaciones y procesar envíos de código de los estudiantes. La aplicación está construida con **NestJS** en el backend y **React** con **Vite** en el frontend.

## Stack Tecnológico

### Backend
- **Framework**: NestJS (Node.js/TypeScript)
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Colas de Trabajo**: Bull (Redis-based)
- **Almacenamiento**: MinIO (S3-compatible)
- **Contenedores**: Docker (Dockerode para ejecución de código)
- **Autenticación**: JWT con Passport
- **Documentación API**: Swagger/OpenAPI
- **IA**: OpenAI y Ollama para generación de desafíos

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Enrutamiento**: React Router DOM
- **Editor de Código**: Monaco Editor
- **Iconos**: Lucide React

## Arquitectura General

La aplicación sigue una **Arquitectura Hexagonal (Ports and Adapters)** con separación clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  - Páginas de usuario                                    │
│  - Componentes reutilizables                             │
│  - Servicios HTTP                                        │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/REST API
┌─────────────────────▼───────────────────────────────────┐
│              PRESENTATION LAYER (Controllers)            │
│  - Controladores REST                                    │
│  - DTOs de entrada/salida                                │
│  - Validación de requests                                │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│            APPLICATION LAYER (Use Cases)                 │
│  - Lógica de negocio                                     │
│  - Orquestación de servicios                             │
│  - Casos de uso específicos                              │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│              DOMAIN LAYER (Entities)                     │
│  - Entidades de dominio                                  │
│  - Interfaces de repositorios (Ports)                    │
│  - Reglas de negocio                                     │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│           INFRASTRUCTURE LAYER (Adapters)                │
│  - Implementación de repositorios (Prisma)               │
│  - Servicios externos (MinIO, Docker, AI)                │
│  - Integraciones                                         │
└──────────────────────────────────────────────────────────┘
```

---

## Módulos Principales del Backend

### 1. **Módulo de Usuarios (Users)**

**Responsabilidad**: Gestión de usuarios y autenticación.

#### Componentes:
- **Controlador**: `UsersController`
- **Casos de Uso**:
  - `CreateUserUseCase`: Crear nuevos usuarios
  - `GetUserUseCase`: Obtener información de usuarios
  - `UpdateUserUseCase`: Actualizar datos de usuario
  - `LoginUseCase`: Autenticación de usuarios
  - `RefreshTokenUseCase`: Renovación de tokens JWT
  
- **Repositorios**:
  - `PrismaUserRepository`: Acceso a datos de usuarios en PostgreSQL
  - `PrismaRoleRepository`: Gestión de roles (Admin, Student)
  
- **Servicios**:
  - `JwtTokenService`: Generación y validación de tokens JWT
  - `JwtStrategy`: Estrategia de autenticación con Passport

#### Modelo de Datos:
- `User`: userId, userName, email, passwordHash, roleId
- `Role`: roleId, name (Admin/Student), permissions
- `Permission`: permissionId, roleId, name, description

---

### 2. **Módulo de Desafíos (Challenges)**

**Responsabilidad**: Gestión de problemas de programación y casos de prueba.

#### Sub-módulos:
- **ChallengeModule**: CRUD de desafíos
- **TestCaseModule**: Gestión de casos de prueba
- **AIChallengeModule**: Generación de desafíos con IA

#### Componentes:
- **Controlador**: `ChallengeController`
- **Casos de Uso**:
  - `CreateChallengeUseCase`: Crear nuevos desafíos
  - `UpdateChallengeUseCase`: Actualizar desafíos existentes
  - `DeleteChallengeUseCase`: Eliminar desafíos
  - `ListChallengesUseCase`: Listar todos los desafíos
  - `findChallengeByIdUseCase`: Buscar desafío por ID
  - `ListTestCasesByChallengeIdUseCase`: Obtener casos de prueba
  - `UpdateStateUseCase`: Cambiar estado (Draft/Published/Archived)

- **Repositorios**:
  - `PrismaChallengeRepository`: Persistencia de desafíos
  - `PrismaTestCaseRepository`: Gestión de casos de prueba

- **Servicios de IA**:
  - `GptProviderService`: Integración con OpenAI
  - `OllamaValidatorService`: Validación con Ollama

#### Modelo de Datos:
- `Challenge`: challengeId, title, difficulty (Easy/Medium/Hard), tags, timeLimit, memoryLimit, description, state
- `TestCase`: testCaseId, challengeId, input, output

---

### 3. **Módulo de Envíos (Submissions)**

**Responsabilidad**: Procesamiento de soluciones de código enviadas por estudiantes.

#### Componentes:
- **Controlador**: `SubmissionController`
- **Casos de Uso**:
  - `CreateSubmissionUseCase`: Registrar nuevo envío
  - `UpdateStatusSubmissionUseCase`: Actualizar estado del envío

- **Repositorios**:
  - `PrismaSubmissionsRepository`: Persistencia de envíos

- **Mappers**:
  - `SubmissionsMapper`: Transformación de datos

#### Modelo de Datos:
- `Submission`: submissionId, user, challengeId, language (Python/C++/Java/Node.js), status (QUEUED/RUNNING/ACCEPTED/WRONG_ANSWER/TIME_LIMIT_EXCEEDED/RUNTIME_ERROR/COMPILATION_ERROR), score, timeMsTotal
- `CaseResult`: caseId, status, timeMs, submissionId

---

### 4. **Módulo de Trabajos (Jobs)**

**Responsabilidad**: Gestión de trabajos de ejecución de código asíncrona.

#### Componentes:
- **Controladores**:
  - `JobsController`: API de trabajos
  - `UploadController`: Carga de archivos

- **Casos de Uso**:
  - `SubmitJobUseCase`: Enviar trabajo a la cola
  - `GetJobUseCase`: Consultar estado de trabajo
  - `ListJobsUseCase`: Listar trabajos

- **Repositorios**:
  - `PrismaJobsRepository`: Persistencia de trabajos

- **Servicios**:
  - `MinioService`: Almacenamiento de archivos de código
  - Cola Bull: `code-execution` queue

#### Modelo de Datos:
- `Job`: id, fileKey, inputKey, language, status (QUEUED/PROCESSING/COMPLETED/FAILED), output, error, exitCode, executionTime, memoryUsed

---

### 5. **Módulo Worker**

**Responsabilidad**: Procesamiento asíncrono de trabajos de ejecución de código.

#### Componentes:
- **Procesador**: `WorkerProcessor`
- **Servicios**:
  - `DockerRunnerService`: Ejecución de código en contenedores Docker aislados
  - `MinioService`: Recuperación de archivos
  - `PrismaJobsRepository`: Actualización de resultados

#### Flujo:
1. Escucha cola `code-execution`
2. Descarga código desde MinIO
3. Ejecuta código en contenedor Docker
4. Captura salida, errores, tiempo y memoria
5. Actualiza estado del job en base de datos

---

### 6. **Módulo de Evaluaciones (Evaluations)**

**Responsabilidad**: Gestión de evaluaciones/exámenes que agrupan desafíos.

#### Componentes:
- **Controlador**: `EvaluationController`
- **Casos de Uso**:
  - `CreateEvaluationUseCase`: Crear evaluación con desafíos
  - `DeleteEvaluationUseCase`: Eliminar evaluación
  - `GetEvaluationUseCase`: Obtener detalles de evaluación

- **Repositorios**:
  - `PrismaEvaluationRepository`: Persistencia de evaluaciones

- **Servicios**:
  - `DateParser`: Manejo de fechas

#### Modelo de Datos:
- `Evaluation`: evaluationId, name, startAt, duration, createdAt
- `EvaluationChallenge`: Relación M:N entre evaluaciones y desafíos
- `EvaluationCourse`: Relación M:N entre evaluaciones y cursos

---

### 7. **Módulo de Cursos (Courses)**

**Responsabilidad**: Gestión de cursos académicos y relaciones con usuarios/desafíos.

#### Componentes:
- **Controlador**: `CoursesController`
- **Casos de Uso**:
  - `createCourseUsecase`: Crear curso
  - `AddChanllengeToCourseUseCase`: Agregar desafío a curso
  - `AddUserToCourseUseCase`: Inscribir usuario a curso
  - `GetAllChallengesCourseUseCase`: Listar desafíos del curso
  - `GetAllUsersInCourseUseCase`: Listar usuarios del curso
  - `GetCourseByNrcUseCase`: Buscar por NRC
  - `GetCourseByTitleUseCase`: Buscar por título

- **Repositorios**:
  - `PrismaCoursesRepository`: Persistencia de cursos

#### Modelo de Datos:
- `Course`: courseId, title, nrc, period, group
- `UserCourse`: Relación M:N con score
- `ChallengeCourse`: Relación M:N entre cursos y desafíos

---

### 8. **Módulo de Roles (Roles)**

**Responsabilidad**: Gestión de roles y permisos del sistema.

#### Componentes:
- **Repositorios**:
  - `PrismaRoleRepository`: Gestión de roles y permisos

---

## Infraestructura y Servicios Compartidos

### Servicios de Infraestructura:

#### **PrismaService**
- Conexión y gestión de base de datos PostgreSQL
- ORM para todas las operaciones de datos

#### **MinioService**
- Almacenamiento de archivos de código
- Generación de URLs pre-firmadas
- Compatible con S3

#### **DockerRunnerService**
- Ejecución segura de código en contenedores aislados
- Límites de tiempo y memoria
- Soporte para múltiples lenguajes

#### **DateParser**
- Utilidad para parsing y conversión de fechas

---

## Frontend (Web)

### Estructura de Páginas:

1. **HomePage**: Página de inicio
2. **LoginPage**: Autenticación de usuarios
3. **ChallengesListPage**: Lista de desafíos disponibles
4. **ChallengeDetailPage**: Detalle y envío de soluciones
5. **CreateChallengePage**: Creación de nuevos desafíos (admin)
6. **AIGeneratePage**: Generación de desafíos con IA
7. **SubmissionsPage**: Historial de envíos

### Componentes:
- Editor de código con Monaco Editor
- Sistema de autenticación y contextos
- Servicios HTTP para comunicación con API
- Componentes reutilizables

---

## Flujo de Ejecución de Código

```
┌──────────────┐
│   Usuario    │
│ envía código │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  Submission      │◄─── Crea envío con estado QUEUED
│  Controller      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   Job Module     │◄─── Crea Job y sube código a MinIO
│                  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Bull Queue      │◄─── Encola trabajo para procesamiento
│ code-execution   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Worker Processor │◄─── Consume trabajo de la cola
│                  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Docker Runner   │◄─── Ejecuta código en contenedor
│    Service       │     con límites de recursos
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   Actualiza      │◄─── Guarda resultados (output, tiempo,
│   Job Status     │     memoria, errores)
└──────────────────┘
```

---

## Patrones de Diseño Aplicados

### 1. **Hexagonal Architecture (Ports & Adapters)**
- Separación clara entre dominio, aplicación e infraestructura
- Interfaces (Ports) definen contratos
- Implementaciones (Adapters) intercambiables

### 2. **Repository Pattern**
- Abstracción del acceso a datos
- Interfaces en capa de dominio
- Implementaciones Prisma en infraestructura

### 3. **Use Case Pattern**
- Cada operación de negocio es un caso de uso
- Lógica de aplicación encapsulada
- Fácil testing y mantenimiento

### 4. **Dependency Injection**
- NestJS provee DI container
- Inversión de control total
- Facilita testing con mocks

### 5. **Factory Pattern**
- Uso de `useFactory` en providers
- Construcción de dependencias complejas

### 6. **Strategy Pattern**
- Múltiples proveedores de IA (OpenAI, Ollama)
- Diferentes estrategias de autenticación

---

## Base de Datos (Prisma Schema)

### Entidades Principales:

1. **User** - Usuarios del sistema
2. **Role** - Roles (Admin, Student)
3. **Permission** - Permisos por rol
4. **Course** - Cursos académicos
5. **Challenge** - Desafíos de programación
6. **TestCase** - Casos de prueba
7. **Submission** - Envíos de código
8. **Job** - Trabajos de ejecución
9. **CaseResult** - Resultados por caso
10. **Evaluation** - Evaluaciones/Exámenes

### Relaciones:
- `User` ↔ `Course` (M:N con UserCourse)
- `Course` ↔ `Challenge` (M:N con ChallengeCourse)
- `Evaluation` ↔ `Challenge` (M:N con EvaluationChallenge)
- `Evaluation` ↔ `Course` (M:N con EvaluationCourse)
- `Challenge` → `TestCase` (1:N)
- `Challenge` → `Submission` (1:N)
- `Submission` → `CaseResult` (1:N)

---

## Tokens de Inyección de Dependencias

Definidos en `src/application/tokens.ts`:

- `CHALLENGE_REPOSITORY`
- `TESTCASE_REPOSITORY`
- `SUBMISSION_REPOSITORY`
- `JOBS_REPOSITORY`
- `USER_REPOSITORY`
- `ROLE_REPOSITORY`
- `TOKEN_SERVICE`
- `EVALUATION_REPOSITORY`
- `COURSE_REPOSITORY`
- `DATE_PARSER`

---

## Configuración y Despliegue

### Docker Compose
- Servicio backend (NestJS)
- PostgreSQL
- Redis (para Bull)
- MinIO

### Variables de Entorno
- `DATABASE_URL`: Conexión PostgreSQL
- `JWT_SECRET`: Secreto para tokens JWT
- Configuración MinIO
- Configuración Redis

### API Documentation
- Swagger UI disponible en `/api`
- Autenticación Bearer JWT
- Documentación completa de endpoints

---

## Seguridad

1. **Autenticación JWT**: Tokens de corta duración (15 min) con refresh
2. **Bcrypt**: Hashing de contraseñas
3. **Guards NestJS**: Protección de rutas
4. **CORS**: Configurado para frontend específico
5. **Docker Isolation**: Ejecución de código en contenedores aislados
6. **Límites de Recursos**: Tiempo y memoria limitados en ejecución

---

## Testing

- **Unit Tests**: Jest configurado
- **E2E Tests**: Disponibles en `/test`
- **Coverage**: Reportes de cobertura

---

## Escalabilidad

1. **Colas de trabajo**: Procesamiento asíncrono con Bull
2. **Workers independientes**: Pueden escalarse horizontalmente
3. **Almacenamiento distribuido**: MinIO S3-compatible
4. **Base de datos relacional**: PostgreSQL con índices optimizados
5. **Contenedores**: Ejecución aislada y paralela de código

---

## Conclusión

CodeBreaker implementa una arquitectura moderna, escalable y mantenible que separa claramente las responsabilidades en capas bien definidas. El uso de patrones de diseño establecidos, inyección de dependencias y procesamiento asíncrono permite que el sistema maneje múltiples envíos de código de manera eficiente y segura.
