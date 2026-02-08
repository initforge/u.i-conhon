.PHONY: up down build logs init-db backup-db shell-db clean

# ============= Docker =============
up:                ## Khởi chạy tất cả containers
	docker compose up -d

build:             ## Build lại + khởi chạy
	docker compose up --build -d

down:              ## Dừng tất cả containers
	docker compose down

restart:           ## Restart backend + frontend
	docker compose restart backend frontend

# ============= Database =============
init-db:           ## Khởi tạo database schema
	docker exec -i conhon-db psql -U conhon -d conhon < database/schema.sql

backup-db:         ## Backup database ra file SQL
	docker exec conhon-db pg_dump -U conhon conhon > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup saved"

shell-db:          ## Truy cập PostgreSQL shell
	docker exec -it conhon-db psql -U conhon -d conhon

# ============= Logs =============
logs:              ## Xem logs tất cả services
	docker compose logs -f --tail 100

logs-be:           ## Xem logs backend
	docker compose logs -f --tail 100 backend

logs-fe:           ## Xem logs frontend (nginx)
	docker compose logs -f --tail 100 frontend

# ============= Deploy =============
deploy:            ## Pull code mới + rebuild
	git fetch origin && git reset --hard origin/ready-production
	docker compose up --build -d
	@echo "✅ Deployed"

# ============= Utilities =============
clean:             ## Xoá containers + volumes (⚠️ mất data)
	docker compose down -v --remove-orphans
	docker system prune -f

status:            ## Kiểm tra trạng thái containers
	docker compose ps

disk:              ## Kiểm tra dung lượng
	docker system df
	@echo "---"
	df -h /opt/conhon

help:              ## Hiện danh sách lệnh
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
