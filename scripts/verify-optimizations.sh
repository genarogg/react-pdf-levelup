#!/bin/bash

# Script para verificar y reportar mejoras de rendimiento

echo "📊 Analizando mejoras de rendimiento..."
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== VERIFICACIÓN DE CONFIGURACIÓN ===${NC}"
echo ""

# 1. Verificar que Tailwind está configurado localmente
if [ -f "frontend/tailwind.config.js" ]; then
    echo -e "${GREEN}✓${NC} Tailwind config encontrado"
else
    echo -e "${YELLOW}✗${NC} Tailwind config no encontrado"
fi

# 2. Verificar que PostCSS está configurado
if [ -f "frontend/postcss.config.js" ]; then
    echo -e "${GREEN}✓${NC} PostCSS config encontrado"
else
    echo -e "${YELLOW}✗${NC} PostCSS config no encontrado"
fi

# 3. Verificar que CSS global existe
if [ -f "frontend/src/styles/index.css" ]; then
    echo -e "${GREEN}✓${NC} Estilos globales encontrados"
else
    echo -e "${YELLOW}✗${NC} Estilos globales no encontrados"
fi

# 4. Verificar caché mejorado en API
if grep -q "86400" "api/src/config/caching.ts"; then
    echo -e "${GREEN}✓${NC} TTL de caché mejorado (24 horas)"
else
    echo -e "${YELLOW}✗${NC} TTL de caché no optimizado"
fi

echo ""
echo -e "${BLUE}=== PASOS RECOMENDADOS ===${NC}"
echo ""
echo "1. Instalar dependencias (si es necesario):"
echo "   cd frontend && npm install tailwindcss postcss autoprefixer --save-dev"
echo ""
echo "2. Hacer build de la aplicación:"
echo "   npm run build"
echo ""
echo "3. Revisar tamaño de bundles:"
echo "   cd frontend && npm run build -- --reporters=verbose"
echo ""
echo "4. Iniciar servidor en desarrollo:"
echo "   npm run dev"
echo ""
echo "5. Validar en Google PageSpeed Insights:"
echo "   https://pagespeed.web.dev/"
echo ""

echo -e "${BLUE}=== VERIFICACION DE ARCHIVOS ===${NC}"
echo ""

# Listar config files
echo "Archivos de configuración creados/modificados:"
ls -lah frontend/tailwind.config.js 2>/dev/null && echo -e "${GREEN}✓${NC}" || echo -e "${YELLOW}✗${NC}"
ls -lah frontend/postcss.config.js 2>/dev/null && echo -e "${GREEN}✓${NC}" || echo -e "${YELLOW}✗${NC}"
ls -lah frontend/src/styles/index.css 2>/dev/null && echo -e "${GREEN}✓${NC}" || echo -e "${YELLOW}✗${NC}"
ls -lah vercel.json 2>/dev/null && echo -e "${GREEN}✓${NC}" || echo -e "${YELLOW}✗${NC}"

echo ""
echo -e "${GREEN}✅ Análisis completado${NC}"
