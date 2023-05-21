package com.github.marceloleite2604.swa;

import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class ChatWebSocketHandler implements WebSocketHandler {

  private List<String> messages;

  @Override
  public Mono<Void> handle(WebSocketSession webSocketSession) {
    return webSocketSession.send(Flux.interval(Duration.of(1, ChronoUnit.SECONDS))
            .flatMap(value -> elaborateTick())
            .map(webSocketSession::textMessage)
            .log())
        .and(webSocketSession.receive()
            .map(WebSocketMessage::getPayloadAsText)
            .map(this::addMessage)
            .log());
  }

  private Mono<String> elaborateTick() {
    return Mono.zip(retrieveTime(), retrieveMessages())
        .flatMap(tuple -> {
          final var stringBuilder = new StringBuilder();
          stringBuilder.append(tuple.getT1());
          if (StringUtils.hasLength(tuple.getT2())) {
            stringBuilder.append(": ")
                .append(tuple.getT2());
          }
          return Mono.just(stringBuilder.toString());
        });
  }

  private synchronized Mono<String> addMessage(String message) {
    if (messages == null) {

      messages = new ArrayList<>();
    }

    messages.add(message);

    return Mono.just(message);
  }

  private synchronized Mono<String> retrieveMessages() {
    if (ObjectUtils.isEmpty(messages)) {
      return Mono.just(Strings.EMPTY);
    }

    final var result = String.join("\n", messages);

    messages.clear();
    return Mono.just(result);
  }

  private Mono<String> retrieveTime() {
    return Mono.just(ZonedDateTime.now(ZoneOffset.UTC)
        .truncatedTo(ChronoUnit.SECONDS)
        .toString());
  }
}
