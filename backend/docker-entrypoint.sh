#!/bin/sh

# Substitute default port 80 with Cloud Run's dynamic PORT environment variable (default to 8080 if not set)
sed -i "s/80/${PORT:-8080}/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Start Apache in the foreground
exec apache2-foreground
