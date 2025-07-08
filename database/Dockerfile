# Use MySQL official image as the base image
FROM mysql:8.0

# Set environment variables (optional, as they are also set in docker-compose.yml)
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=microservices_db
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password

# Copy custom configuration files if needed
# COPY my.cnf /etc/mysql/conf.d/

# Copy initialization scripts if needed
# COPY init.sql /docker-entrypoint-initdb.d/

# Expose the MySQL port
EXPOSE 3306

# The default command is already set in the base image to start MySQL
