package com.github.marceloleite2604.swa;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.temporal.ChronoUnit;

@Slf4j
@Component
public class ChatWebSocketHandler implements WebSocketHandler {

  @Override
  public Mono<Void> handle(WebSocketSession webSocketSession) {
    return webSocketSession.send(Flux.interval(Duration.of(1, ChronoUnit.SECONDS))
            .map(Object::toString)
            .map(webSocketSession::textMessage)
            .log())
        .and(webSocketSession.receive()
            .map(WebSocketMessage::getPayloadAsText)
            .log());
  }
}
