package com.github.marceloleite2604.swa.configuration;

import com.github.marceloleite2604.swa.EchoWebSocketHandler;
import org.apache.logging.log4j.util.Strings;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtGrantedAuthoritiesConverterAdapter;
import org.springframework.security.oauth2.server.resource.web.server.authentication.ServerBearerTokenAuthenticationConverter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;

import java.util.List;
import java.util.Map;

@Configuration
@EnableWebFluxSecurity
class WebConfiguration {

  private static final int BEFORE_ANNOTATED_CONTROLLERS_ORDER = -1;

  @Bean
  public HandlerMapping createHandlerMapping(EchoWebSocketHandler echoWebSocketHandler) {
    final var map = Map.of("/echo", echoWebSocketHandler);
    return new SimpleUrlHandlerMapping(map, BEFORE_ANNOTATED_CONTROLLERS_ORDER);
  }

  @Bean
  public SecurityWebFilterChain createSecurityWebFilterChain(
      ServerHttpSecurity serverHttpSecurity,
      ServerBearerTokenAuthenticationConverter serverBearerTokenAuthenticationConverter) {
    serverHttpSecurity
        .authorizeExchange(exchanges -> exchanges
            .pathMatchers("/echo/**")
            .hasAuthority("websocket-access")
            .anyExchange()
            .authenticated()
        )
        .oauth2ResourceServer(oAuth2ResourceServerSpec ->
            oAuth2ResourceServerSpec.jwt(Customizer.withDefaults())
                .bearerTokenConverter(serverBearerTokenAuthenticationConverter));
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

  @Bean
  public ServerBearerTokenAuthenticationConverter createServerBearerTokenAuthenticationConverter() {
    final var serverBearerTokenAuthenticationConverter = new ServerBearerTokenAuthenticationConverter();

    serverBearerTokenAuthenticationConverter.setAllowUriQueryParameter(true);
    return serverBearerTokenAuthenticationConverter;
  }

  @Bean
  public CorsConfigurationSource createCorsWebFilter() {
    final var corsConfiguration = new CorsConfiguration();
    corsConfiguration.addAllowedOrigin("http://localhost:3000");
    corsConfiguration.setAllowedMethods(List.of("GET", "POST"));

    final var urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
    urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);

    return urlBasedCorsConfigurationSource;
  }
}