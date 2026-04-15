# Expense tracker - zarządzanie wydatkami domowymi by Mateusz Zgardowski, 95964

Projekt natywnej aplikacji chmurowej realizowany w architekturze 3-warstwowej.

## Wymagany .env

```
VITE_API_URL
```

## Uruchomienie Dockera

```
docker compose up -d
```

## Deklaracja Architektury (Mapowanie Azure)

Ten projekt został zaplanowany z myślą o usługach PaaS (Platform as a Service) w chmurze Azure.

| Warstwa          | Komponent Lokalny    | Usługa Azure                    |
| :--------------- | :------------------- | :------------------------------ |
| **Presentation** | React 19 (Vite)      | Azure Static Web Apps           |
| **Application**  | API NestJS (Node 24) | Azure App Service               |
| **Data**         | SQL (Dev)            | Azure SQL Database (Serverless) |

## 🏗 Status Projektu i Dokumentacja

- [x] **Artefakt 1:** Zaplanowano strukturę folderów i diagram C4 (dostępny w `/docs`).
- [x] **Artefakt 2:** Konfiguracja środowiska Docker.
- [x] **Artefakt 3:** Działająca warstwa prenzentacji
- [x] **Artefakt 4:** Działająca warstwa logiki backendu (NestJS + SQL Connection)
- [x] **Artefakt 5:** System gotowy na chmurę
- [x] **Artefakt 6:** Aplikacja wdrożona na Azure
- [x] **Artefakt 7:** Zabezpieczona aplikacja
- [x] **Artefakt 8:** Wybudowany “bezpiecznik” i wdrożony automatu CI/CD

> **Informacja:** Ten plik będzie ewoluował. W kolejnych etapach dodamy tutaj sekcje 'Quick Start', opis zmiennych środowiskowych oraz instrukcję wdrożenia (CI/CD).
