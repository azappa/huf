const chalk = require('chalk');
const Twitter = require('twitter-lite');

const { log, error } = console;

const LOGO = String.raw`
          
$$\                  $$$$$$\  
$$ |                $$  __$$\ 
$$$$$$$\  $$\   $$\ $$ /  \__|
$$  __$$\ $$ |  $$ |$$$$\     
$$ |  $$ |$$ |  $$ |$$  _|    
$$ |  $$ |$$ |  $$ |$$ |      
$$ |  $$ |\$$$$$$  |$$ |      
\__|  \__| \______/ \__|      
                              
`;

const parseTweet = (tweet) => {
  const {
    created_at: createdAt,
    entities: { media },
    text,
    user: { name, screen_name: screenName },
  } = tweet;
  const medias =
    media && media.length > 0 && media.map((m) => m.media_url_https).join(', ');

  log(
    `🐥  ${chalk.blueBright.bold(name)} ${chalk.blueBright.italic(
      `@${screenName}`
    )}`
  );
  log(`💬  ${chalk.white(text)}`);
  if (medias && medias.length > 0) {
    log(`🏙   ${medias}`);
  }
  log(chalk.grey(`🕘  ${createdAt}`));
  log(`\n`);
};

async function setupTwitterClient() {
  return new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  });
}

(async function huf() {
  const twClient = await setupTwitterClient();
  const params = { track: `#${process.env.HASHTAG}` };

  twClient
    .stream('statuses/filter', params)
    .on('start', () => log(chalk.magenta(LOGO)))
    .on('data', (tweet) => parseTweet(tweet))
    .on('ping', () => log('🏓\n'))
    .on('error', (err) => error('💣 ', err))
    .on('end', () => log('👋🏻\n'));
})();
