commands_greeting-test = Привет {$fullName}!

# Chat join request admin notification module

## Request text
chat-join-request_admin-notify-text =
  Заявка {$id}
  Запрос на добавление пользователя {$userLink} в чат {$chatLink}
  Проверить пользователя можно по {$verifyLink}

## Response buttons
chat-join-request_approve = Подтвердить
chat-join-request_decline = Отклонить

## Notification all admins text
chat-join-request_admin-approve-text = Заявка {$id} принята {$adminLink}
chat-join-request_admin-reject-text = Заявка {$id} отклонена {$adminLink}
chat-join-request_admin-error-text =
  Не удалось принять/отклонить заявку {$id}
  Запрос от {$adminLink}\. Текст ошибки:
  {$errorText}
## Action executed callbacks
chat-join-request_unknown-command = Неизвестная команда
chat-join-request_added-to-group = Добавлен в группу
chat-join-request_declined-to-group = Отклонён

## User actions
chat-join-verify-message = Здравствуйте, {$fullName}\!
  Вы подали заявку на вступление в чат {$chatLink}\.
  Чтобы убедиться, что это действительно ваш аккаунт расшарьте пожалуйста ваши контактные данные\.
  Заранее спасибо\!
chat-join-phone-contact = Отправить контакт
chat-join-phone-contact_admin-text =
  Пользователь {$userLink} прислал свои контактные данные:
  `{$phone}`
  Проверить пользователя можно по {$verifyLink}
