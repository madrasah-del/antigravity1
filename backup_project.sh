#!/bin/bash
PROJECT_DIR=$(pwd)
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
VERSION=$(grep "v1.0 (Live)" Header.tsx | sed 's/.*v\([0-9.]*\).*/\1/') 
BACKUP_DIR="/Users/javeedjoosub/Documents/EEIS Master File/Iftar projects/Backups/${TIMESTAMP}_v${VERSION:-1.0}"

mkdir -p "$BACKUP_DIR"
cp -R "$PROJECT_DIR/" "$BACKUP_DIR/"
echo "Backup created at $BACKUP_DIR"
