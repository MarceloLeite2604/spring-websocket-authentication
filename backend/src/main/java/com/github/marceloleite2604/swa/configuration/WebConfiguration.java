package com.github.marceloleite2604.swa.configuration;

import com.github.marceloleite2604.swa.ChatWebSocketHandler;
import org.apache.logging.log4j.util.Strings;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtGrantedAuthoritiesConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;

import java.util.Map;

@Configuration
@EnableWebFluxSecurity
class WebConfiguration {

  private static final int BEFORE_ANNOTATED_CONTROLLERS_ORDER = -1;

  @Bean
  public HandlerMapping createHandlerMapping(ChatWebSocketHandler chatWebSocketHandler) {
    final var map = Map.of("/chat", chatWebSocketHandler);
    return new SimpleUrlHandlerMapping(map, BEFORE_ANNOTATED_CONTROLLERS_ORDER);
  }

  @Bean
  public SecurityWebFilterChain createSecurityWebFilterChain(ServerHttpSecurity serverHttpSecurity) {
    serverHttpSecurity
        .authorizeExchange(exchanges -> exchanges
            .pathMatchers("/chat/**")
            .hasAuthority("chat-websocket-comm")
            .anyExchange()
            .authenticated()
        )
        .oauth2ResourceServer(oAuth2ResourceServerSpec ->
            oAuth2ResourceServerSpec.jwt(Customizer.withDefaults()));
    return serverHttpSecurity.build();
  }

  @Bean
  static GrantedAuthorityDefaults createGrantedAuthorityDefaults() {
    return new GrantedAuthorityDefaults(Strings.EMPTY);
  }

  @Bean
  public ReactiveJwtAuthenticationConverter createJwtAuthenticationConverter() {
    final var jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

    jwtGrantedAuthoritiesConverter.setAuthorityPrefix(Strings.EMPTY);
    jwtGrantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
    final var reactiveJwtGrantedAuthoritiesConverterAdapter = new ReactiveJwtGrantedAuthoritiesConverterAdapter(jwtGrantedAuthoritiesConverter);

    final var reactiveJwtAuthenticationConverter = new ReactiveJwtAuthenticationConverter();
    reactiveJwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(reactiveJwtGrantedAuthoritiesConverterAdapter);
    return reactiveJwtAuthenticationConverter;
  }
}