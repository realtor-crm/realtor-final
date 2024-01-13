FROM quay.io/keycloak/keycloak:latest
# Check if realms directory exists and if so, add it
RUN if [ -d "./realms" ]; then ADD ./realms /opt/keycloak/data/import/; fi
# Import all files
RUN /opt/keycloak/bin/kc.sh import --dir=/opt/keycloak/data/import/ ; exit 0
# Start image
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "-v", "start-dev"]