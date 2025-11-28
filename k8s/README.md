# Kubernetes Manifests for CodeBreaker

Este directorio contiene todos los manifiestos de Kubernetes necesarios para desplegar la aplicación CodeBreaker.

## Arquitectura de Despliegue

```
┌─────────────────────────────────────────────────────────┐
│                    Ingress Controller                    │
│              (api.codebreaker.local)                     │
└─────────────────┬───────────────────────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
┌───▼────┐                 ┌───▼────┐
│  Web   │                 │  API   │
│Service │                 │Service │
└───┬────┘                 └───┬────┘
    │                          │
┌───▼─────┐              ┌────▼─────┐
│   Web   │              │   API    │
│Deployment│              │Deployment│
│(2 pods) │              │(2 pods)  │
└─────────┘              └──┬───────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
          ┌───▼───┐    ┌───▼────┐   ┌───▼────┐
          │Postgres│   │ Redis  │   │ MinIO  │
          │Service │   │Service │   │Service │
          └───┬───┘    └───┬────┘   └───┬────┘
              │            │            │
          ┌───▼───┐    ┌───▼────┐   ┌───▼────┐
          │Postgres│   │ Redis  │   │ MinIO  │
          │  PVC   │   │  PVC   │   │  PVC   │
          └────────┘   └────────┘   └────────┘

┌──────────────────────────────────────────────────────────┐
│             Worker Deployment (Auto-scaled)              │
│  ┌──────┐  ┌──────┐  ┌──────┐         ┌──────┐          │
│  │Worker│  │Worker│  │Worker│   ...   │Worker│          │
│  │ Pod  │  │ Pod  │  │ Pod  │         │ Pod  │          │
│  └──────┘  └──────┘  └──────┘         └──────┘          │
│                                                          │
│  HPA/KEDA: 2-20 replicas based on Redis queue           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│        Ephemeral Jobs (One per Submission)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │Submission│  │Submission│  │Submission│               │
│  │  Job 1   │  │  Job 2   │  │  Job 3   │   ...        │
│  └──────────┘  └──────────┘  └──────────┘               │
│                                                          │
│  TTL: 1 hour after completion                            │
└──────────────────────────────────────────────────────────┘
```

## Componentes

### Infraestructura Base
- **00-namespace.yaml**: Namespace `codebreaker`
- **01-secrets.yaml**: Secrets para credenciales
- **02-configmap.yaml**: Configuración de la aplicación

### Almacenamiento
- **03-postgres-pvc.yaml**: PVC para PostgreSQL (10Gi)
- **05-redis-pvc.yaml**: PVC para Redis (5Gi)
- **07-minio-pvc.yaml**: PVC para MinIO (20Gi)

### Bases de Datos y Servicios
- **04-postgres-deployment.yaml**: PostgreSQL 15
- **06-redis-deployment.yaml**: Redis 7 (para colas Bull)
- **08-minio-deployment.yaml**: MinIO (almacenamiento S3)

### Aplicación
- **09-api-deployment.yaml**: API REST (NestJS) - 2 réplicas
- **14-web-deployment.yaml**: Frontend (React + Vite) - 2 réplicas

### Workers y Auto-escalado
- **10-worker-deployment.yaml**: Workers para procesamiento asíncrono - 2-20 réplicas
- **11-worker-hpa.yaml**: HPA basado en CPU/Memoria (70%/80%)
- **12-worker-keda.yaml**: KEDA ScaledObject basado en longitud de cola Redis

### Jobs Efímeros
- **13-submission-job-template.yaml**: Template para Jobs de ejecución de código
  - Se crea un Job por cada submission
  - TTL: 1 hora después de completarse
  - Límites de recursos configurables

### Networking
- **15-ingress.yaml**: Ingress para exponer la aplicación
- **16-network-policy.yaml**: Políticas de red para seguridad

## Requisitos Previos

1. **Cluster de Kubernetes** (v1.24+)
2. **kubectl** configurado
3. **Ingress Controller** (NGINX, Traefik, etc.)
   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.4/deploy/static/provider/cloud/deploy.yaml
   ```

4. **KEDA** (opcional, para auto-escalado basado en cola)
   ```bash
   kubectl apply -f https://github.com/kedacore/keda/releases/download/v2.12.0/keda-2.12.0.yaml
   ```

5. **Metrics Server** (para HPA)
   ```bash
   kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
   ```

6. **StorageClass** configurado (para PVCs)

## Despliegue

### 1. Crear namespace y configuración base
```bash
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-secrets.yaml
kubectl apply -f 02-configmap.yaml
```

### 2. Crear PVCs
```bash
kubectl apply -f 03-postgres-pvc.yaml
kubectl apply -f 05-redis-pvc.yaml
kubectl apply -f 07-minio-pvc.yaml
```

### 3. Desplegar servicios de infraestructura
```bash
kubectl apply -f 04-postgres-deployment.yaml
kubectl apply -f 06-redis-deployment.yaml
kubectl apply -f 08-minio-deployment.yaml
```

Esperar a que los servicios estén listos:
```bash
kubectl wait --for=condition=ready pod -l app=postgres -n codebreaker --timeout=300s
kubectl wait --for=condition=ready pod -l app=redis -n codebreaker --timeout=300s
kubectl wait --for=condition=ready pod -l app=minio -n codebreaker --timeout=300s
```

### 4. Construir y subir imágenes Docker

**API/Worker:**
```bash
docker build -t your-registry/codebreaker-api:latest .
docker push your-registry/codebreaker-api:latest
```

**Frontend:**
```bash
cd web
docker build -t your-registry/codebreaker-web:latest .
docker push your-registry/codebreaker-web:latest
```

**Actualizar los manifiestos** con tu registry en:
- `09-api-deployment.yaml`
- `10-worker-deployment.yaml`
- `13-submission-job-template.yaml`
- `14-web-deployment.yaml`

### 5. Desplegar la aplicación
```bash
kubectl apply -f 09-api-deployment.yaml
kubectl apply -f 14-web-deployment.yaml
```

### 6. Desplegar workers con auto-escalado

**Opción A: HPA (basado en CPU/Memoria)**
```bash
kubectl apply -f 10-worker-deployment.yaml
kubectl apply -f 11-worker-hpa.yaml
```

**Opción B: KEDA (basado en cola Redis) - Recomendado**
```bash
kubectl apply -f 10-worker-deployment.yaml
kubectl apply -f 12-worker-keda.yaml
```

### 7. Configurar Ingress
```bash
kubectl apply -f 15-ingress.yaml
```

### 8. Aplicar Network Policies (opcional pero recomendado)
```bash
kubectl apply -f 16-network-policy.yaml
```

### 9. Configurar DNS local (para desarrollo)
Agregar a `/etc/hosts` (Linux/Mac) o `C:\Windows\System32\drivers\etc\hosts` (Windows):
```
<INGRESS_IP> codebreaker.local api.codebreaker.local
```

Obtener IP del Ingress:
```bash
kubectl get ingress -n codebreaker
```

## Actualizar Secretos

**IMPORTANTE**: Actualizar los secretos antes de desplegar en producción:

```bash
kubectl create secret generic codebreaker-secrets \
  --from-literal=POSTGRES_PASSWORD='your-strong-password' \
  --from-literal=JWT_SECRET='your-super-secret-jwt-key' \
  --from-literal=MINIO_ROOT_PASSWORD='your-minio-password' \
  --from-literal=MINIO_SECRET_KEY='your-minio-secret' \
  -n codebreaker \
  --dry-run=client -o yaml | kubectl apply -f -
```

## Creación de Jobs de Submission

Los Jobs de submission se crean dinámicamente desde el API cuando un estudiante envía código. El template está en `13-submission-job-template.yaml`.

**Ejemplo de creación desde código (NestJS):**

```typescript
import { KubernetesClient } from '@kubernetes/client-node';

async createSubmissionJob(submissionId: string, challengeId: string, language: string) {
  const k8sApi = new KubernetesClient();
  
  const jobManifest = {
    apiVersion: 'batch/v1',
    kind: 'Job',
    metadata: {
      name: `submission-${submissionId}`,
      namespace: 'codebreaker',
      labels: {
        'app': 'submission-runner',
        'submission-id': submissionId,
        'challenge-id': challengeId
      }
    },
    spec: {
      ttlSecondsAfterFinished: 3600,
      backoffLimit: 2,
      activeDeadlineSeconds: 300,
      template: {
        metadata: {
          labels: {
            'app': 'submission-runner',
            'submission-id': submissionId
          }
        },
        spec: {
          restartPolicy: 'Never',
          serviceAccountName: 'submission-runner-sa',
          containers: [{
            name: 'runner',
            image: 'your-registry/codebreaker-runner:latest',
            env: [
              { name: 'SUBMISSION_ID', value: submissionId },
              { name: 'CHALLENGE_ID', value: challengeId },
              { name: 'LANGUAGE', value: language },
              // ... más variables de entorno
            ],
            resources: {
              requests: { memory: '512Mi', cpu: '500m' },
              limits: { memory: '2Gi', cpu: '2000m' }
            }
          }]
        }
      }
    }
  };
  
  await k8sApi.batchV1Api.createNamespacedJob('codebreaker', jobManifest);
}
```

## Monitoreo

### Ver estado de los pods
```bash
kubectl get pods -n codebreaker -w
```

### Ver logs de un componente
```bash
# API
kubectl logs -f deployment/api -n codebreaker

# Worker
kubectl logs -f deployment/worker -n codebreaker

# Submission Job específico
kubectl logs -f job/submission-<ID> -n codebreaker
```

### Ver estado de auto-escalado
```bash
# HPA
kubectl get hpa -n codebreaker -w

# KEDA
kubectl get scaledobject -n codebreaker -w
```

### Ver Jobs de submissions
```bash
kubectl get jobs -n codebreaker -l app=submission-runner
```

## Escalado Manual

```bash
# Escalar API
kubectl scale deployment api --replicas=5 -n codebreaker

# Escalar Workers
kubectl scale deployment worker --replicas=10 -n codebreaker
```

## Limpieza

### Eliminar todo
```bash
kubectl delete namespace codebreaker
```

### Eliminar solo la aplicación (mantener datos)
```bash
kubectl delete deployment,service,ingress,hpa,scaledobject -n codebreaker --all
```

### Eliminar Jobs antiguos manualmente
```bash
kubectl delete jobs -n codebreaker -l app=submission-runner --field-selector status.successful=1
```

## Troubleshooting

### Pods en estado Pending
```bash
kubectl describe pod <pod-name> -n codebreaker
```
Posibles causas:
- Recursos insuficientes
- PVC no puede ser provisionado
- Node selector no coincide

### Jobs de submission fallando
```bash
kubectl logs job/submission-<ID> -n codebreaker
kubectl describe job submission-<ID> -n codebreaker
```

### Workers no escalando con KEDA
```bash
kubectl logs -n keda deployment/keda-operator
kubectl get scaledobject worker-scaledobject -n codebreaker -o yaml
```

### API no puede conectar a la base de datos
```bash
kubectl exec -it deployment/api -n codebreaker -- sh
# Dentro del pod:
nc -zv postgres-service 5432
```

## Configuración de Producción

### 1. Habilitar TLS/SSL
Actualizar `15-ingress.yaml` con certificados TLS:
```yaml
spec:
  tls:
  - hosts:
    - codebreaker.yourdomain.com
    secretName: codebreaker-tls
```

### 2. Usar bases de datos gestionadas
Actualizar `02-configmap.yaml` con URLs de servicios externos:
- AWS RDS para PostgreSQL
- AWS ElastiCache para Redis
- AWS S3 para almacenamiento

### 3. Configurar límites de recursos apropiados
Ajustar recursos basándose en carga real:
```yaml
resources:
  requests:
    memory: "1Gi"
    cpu: "1000m"
  limits:
    memory: "4Gi"
    cpu: "4000m"
```

### 4. Habilitar Pod Disruption Budgets
```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-pdb
  namespace: codebreaker
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: api
```

### 5. Configurar Resource Quotas
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: codebreaker-quota
  namespace: codebreaker
spec:
  hard:
    requests.cpu: "50"
    requests.memory: 100Gi
    persistentvolumeclaims: "10"
```

## Seguridad

1. **Secrets Management**: Considerar usar herramientas como Sealed Secrets o External Secrets Operator
2. **RBAC**: Los ServiceAccounts tienen permisos mínimos necesarios
3. **Network Policies**: Limitan la comunicación entre pods
4. **Security Context**: Los contenedores corren sin privilegios elevados
5. **Resource Limits**: Previene que un Job consuma todos los recursos

## Performance

- **API**: 2+ réplicas con load balancing
- **Workers**: Auto-escalan de 2 a 20 según carga
- **Jobs**: Recursos aislados por submission
- **Caching**: Redis para colas y caché
- **Storage**: PVCs con StorageClass apropiado (SSD recomendado)

## Costos

Para optimizar costos en cloud:
- Usar node pools con preemptible/spot instances para workers
- Configurar cluster autoscaler
- Ajustar TTL de Jobs para limpiar recursos automáticamente
- Usar HPA conservador en desarrollo, KEDA en producción
