import Discord from 'discord.js';
import mysql from 'mysql';
import Influx from 'influx';

import Server from 'squad-server';
import SquadLayerFilter from 'connectors/squad-layer-filter';

import {
  discordAdminBroadcast,
  discordAdminCamLogs,
  discordChat,
  discordChatAdminRequest,
  discordRCON,
  discordServerStatus,
  discordTeamkill,
  influxdbLog,
  influxdbLogDefaultSchema,
  mapvote,
  mysqlLog,
  teamRandomizer,
  seedingMessage
} from 'plugins';

async function main() {
  const server = new Server({
    id: 1,

    host: 'xxx.xxx.xxx.xxx',
    queryPort: 27165,
    rconPort: 21114,
    rconPassword: 'password',

    // Uncomment the following lines to read logs over FTP.
    // ftpPort: 21,
    // ftpUser: 'FTP Username',
    // ftpPassword: 'FTP Password',
    // logReaderMode: 'ftp',

    logDir: 'C:/path/to/squad/log/folder'
  });

  // Discord Plugins
  const discordClient = new Discord.Client();
  await discordClient.login('Discord Login Token');
  await discordAdminBroadcast(server, discordClient, 'Discord Channel ID');
  await discordAdminCamLogs(server, discordClient, 'Discord Channel ID');
  await discordChat(server, discordClient, 'Discord Channel ID');
  await discordChatAdminRequest(server, discordClient, 'Discord Channel ID', {
    pingGroups: ['discordGroupID']
  });
  await discordRCON(server, discordClient, 'Discord Channel ID');
  await discordServerStatus(server, discordClient);
  await discordTeamkill(server, discordClient, 'Discord Channel ID');

  // in game features
  const squadLayerFilter = SquadLayerFilter.buildFromFilter({});
  mapvote(server, 'didyoumean', squadLayerFilter, {});

  teamRandomizer(server);
  seedingMessage(server);

  // MySQL Plugins
  const mysqlPool = mysql.createPool({
    connectionLimit: 10,
    host: 'host',
    port: 3306,
    user: 'squadjs',
    password: 'password',
    database: 'squadjs'
  });
  mysqlLog(server, mysqlPool);

  // Influx Plugins
  const influxDB = new Influx.InfluxDB({
    host: 'host',
    port: 8086,
    username: 'squadjs',
    password: 'password',
    database: 'squadjs',
    schema: influxdbLogDefaultSchema
  });
  influxdbLog(server, influxDB);

  await server.watch();
}

main();
