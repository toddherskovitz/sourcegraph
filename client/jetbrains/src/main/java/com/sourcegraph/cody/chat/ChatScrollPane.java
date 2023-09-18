package com.sourcegraph.cody.chat;

import com.intellij.ui.components.JBScrollPane;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import javax.swing.*;

public class ChatScrollPane extends JBScrollPane {
  AtomicBoolean wasMouseWheelScrolled = new AtomicBoolean(false);
  AtomicBoolean wasScrollBarDragged = new AtomicBoolean(false);
  AtomicInteger lastManualValue = new AtomicInteger(-1);

  public ChatScrollPane(JPanel messagesPanel) {
    super(
        messagesPanel,
        JBScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED,
        JBScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
    this.setBorder(BorderFactory.createEmptyBorder());
    // this hack allows us to guess if an adjustment event isn't caused by the user mouse wheel
    // scrolling and drag scrolling;
    // we need to do that, as AdjustmentEvent doesn't account for the mouse wheel/drag scroll,
    // and we don't want to rob the user of those
    this.addMouseWheelListener(e -> wasMouseWheelScrolled.set(true));
    // Scroll all the way down after each message
    JScrollBar chatPanelVerticalScrollBar = this.getVerticalScrollBar();
    chatPanelVerticalScrollBar.addMouseListener(
        new MouseAdapter() {
          @Override
          public void mousePressed(MouseEvent e) {
            wasScrollBarDragged.set(true);
            Optional.ofNullable(e.getSource())
                .filter(source -> source instanceof JScrollBar)
                .map(source -> (JScrollBar) source)
                .flatMap(scrollBar -> Optional.ofNullable(scrollBar.getModel()))
                .ifPresent(brm -> lastManualValue.set(brm.getValue()));
          }

          @Override
          public void mouseReleased(MouseEvent e) {
            wasScrollBarDragged.set(false);
            Optional.ofNullable(e.getSource())
                .filter(source -> source instanceof JScrollBar)
                .map(source -> (JScrollBar) source)
                .flatMap(scrollBar -> Optional.ofNullable(scrollBar.getModel()))
                .ifPresent(brm -> lastManualValue.set(brm.getValue()));
          }
        });
    chatPanelVerticalScrollBar.addAdjustmentListener(
        e ->
            Optional.ofNullable(e.getSource())
                .filter(source -> source instanceof JScrollBar)
                .map(source -> (JScrollBar) source)
                .flatMap(scrollBar -> Optional.ofNullable(scrollBar.getModel()))
                // don't adjust if the user is himself scrolling
                .filter(brm -> !brm.getValueIsAdjusting())
                .filter(source -> !wasMouseWheelScrolled.getAndSet(false))
                .filter(source -> !wasScrollBarDragged.getAndSet(false))
                .filter(brm -> lastManualValue.get() < brm.getMaximum())
                // only adjust if the scroll isn't at the bottom already
                .filter(brm -> brm.getValue() + brm.getExtent() != brm.getMaximum())
                // if all the above conditions are met, adjust the scroll to the bottom
                .ifPresent(
                    brm -> {
                      if (lastManualValue.get() > -1 && lastManualValue.get() < brm.getMaximum())
                        brm.setValue(lastManualValue.get());
                      else {
                        brm.setValue(brm.getMaximum());
                        lastManualValue.set(-1);
                      }
                    }));
  }
}
