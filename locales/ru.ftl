# $username - (global) user fullName if available
commands_greeting-test = Привет { $username }!

# Chat join request admin notification module

chat-join-request_admin-notify-text =
  Заявка \#{$id}
  Запрос на добавление пользователя {$userLink} в чат {$chatLink}
  Проверить пользователя можно по {$verifyLink}
chat-join-request_approve = Подтвердить
chat-join-request_decline = Отклонить
chat-join-request_approved_message = Заявка #{$id} принята админом {$adminLink}
chat-join-request_unknown-command = Неизвестная команда
chat-join-request_added-to-group = Добавлен в группу
chat-join-request_declined-to-group = Отклонён
