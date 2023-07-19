package com.sourcegraph.cody.chat;

import com.intellij.openapi.project.Project;
import java.awt.*;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import javax.swing.*;
import org.commonmark.ext.gfm.tables.TablesExtension;
import org.commonmark.node.*;
import org.commonmark.parser.Parser;
import org.jetbrains.annotations.NotNull;

public class ChatBubble extends JPanel {
  private final AtomicReference<String> lastMessage = new AtomicReference<>("");

  private final @NotNull Project project;

  public ChatBubble(
      @NotNull ChatMessage message, @NotNull Project project, @NotNull JPanel parentPanel) {
    super();
    this.setLayout(new BorderLayout());
    lastMessage.set(message.getDisplayText());

    this.project = project;
    JPanel messagePanel = buildMessagePanel(message, this.project, parentPanel);
    this.add(messagePanel);
  }

  @NotNull
  private JPanel buildMessagePanel(
      @NotNull ChatMessage message, @NotNull Project project, @NotNull JPanel parentPanel) {
    /* Create panel */
    MessagePanel messagePanel =
        new MessagePanel(message.getSpeaker(), ChatUIConstants.ASSISTANT_MESSAGE_GRADIENT_WIDTH);

    /* Convert markdown-formatted chat message to Swing components */
    Parser parser = Parser.builder().extensions(List.of(TablesExtension.create())).build();
    Node document = parser.parse(message.getDisplayText());
    MessageContentCreatorFromMarkdownNodes messageContentCreator =
        new MessageContentCreatorFromMarkdownNodes(
            project,
            messagePanel,
            parentPanel,
            message.getSpeaker(),
            ChatUIConstants.ASSISTANT_MESSAGE_GRADIENT_WIDTH);
    document.accept(messageContentCreator);

    return messagePanel;
  }

  /**
   * This is useful when receiving the streamed response. In the background, it removes the last
   * message and adds the updated one.
   */
  public void updateText(@NotNull ChatMessage message, @NotNull JPanel parentPanel) {
    if (message.getDisplayText().length() < lastMessage.get().length()) {
      return;
    } else lastMessage.set(message.getDisplayText());
    JPanel newMessage = buildMessagePanel(message, this.project, parentPanel);
    this.setIgnoreRepaint(true);
    this.remove(0);
    this.add(newMessage, BorderLayout.CENTER, 0);
    this.setIgnoreRepaint(false);
    this.revalidate();
    this.repaint();
  }

  @NotNull
  public String getLastMessage() {
    return lastMessage.get();
  }
}
