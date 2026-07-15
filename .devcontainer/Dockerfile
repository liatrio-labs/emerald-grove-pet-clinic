# Not actually used by the devcontainer, but it is used by gitpod.
# NOTE: this base image family is frozen at JDK 17; the effective JDK used by
# the build is installed and selected via SDKMAN below (see JAVA_VERSION).
ARG VARIANT=17-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/java:0-${VARIANT}
ARG NODE_VERSION="none"
RUN if [ "${NODE_VERSION}" != "none" ]; then su vscode -c "umask 0002 && . /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} 2>&1"; fi
ARG USER=vscode
VOLUME /home/$USER/.m2
# Installs Temurin 26 (satisfies pom.xml java.version >= 25); CI runs a 25 + 26 matrix.
ARG JAVA_VERSION=26.0.1-tem
RUN mkdir /home/$USER/.m2 && chown $USER:$USER /home/$USER/.m2
RUN bash -lc '. /usr/local/sdkman/bin/sdkman-init.sh && sdk install java $JAVA_VERSION && sdk default java $JAVA_VERSION'
