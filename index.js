const TelegramApi = require("node-telegram-bot-api");
const {gameOptions, againOptions} = require('./options')
const token = "7250437888:AAFuh9UGGXRz6HhK69Qjrg1eIhkIBB1Hnlk";

const bot = new TelegramApi(token, { polling: true });

const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты попробуешь ее угадать!`)
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/game', description: 'Игра угадай цифру'},
    ])
    
    bot.on("message", async msg => {
      const text = msg.text;
      const chatId = msg.chat.id;
    
      if (text === "/start") {
        await bot.sendSticker(chatId, 'https://sl.combot.org/yourfren/webp/6xf09f9889.webp')
        return bot.sendMessage(
          chatId,
          `Добро пожаловать, ${msg.from.first_name} в телеграм бот Mr.Udali! Этот бот, впредь твой ремувер бро, поможет удалить фон любой отправленной тобой картинки.`
        );
      }
      if (text === '/game') {
        return startGame(chatId);
      }
      return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!)')
    })

    bot.on('callback_query', async msg => {
      const data = msg.data;
      const chatId = msg.message.chat.id;
      if (data === '/again') {
        return startGame(chatId)
      }
      if (data === chats[chatId]) {
        return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
      } else {
        return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
      }
    })
}

start()