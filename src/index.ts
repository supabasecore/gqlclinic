import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import reniecRoute from "./api/reniec";
import sunatRoute from "./api/sunat";
import { AppDataSource } from "./config";
import { COOKIE_NAME } from "./constants";
import session from "express-session";
import Redis from "ioredis";
import { UserResolver } from "./resolvers/user.resolver";
import { ComprehensiveResolver } from "./resolvers/comprehensive.resolver";
import { ServiceResolver } from "./resolvers/service.resolver";
import { AuxiliaryResolver } from "./resolvers/auxiliary.resolver";
import { DiagnosticResolver } from "./resolvers/diagnostic.resolver";
import { DiaryResolver } from "./resolvers/diary.resolver";
import { DiseaseResolver } from "./resolvers/disease.resolver";
import { HistoryResolver } from "./resolvers/history.resolver";
import { PatientResolver } from "./resolvers/patient.resolver";
import { TreatmentResolver } from "./resolvers/treatment.resolver";
import { VitalResolver } from "./resolvers/vital.resolver";

const main = async () => {
  await AppDataSource.initialize();

  const app = express();

  const RedisStore = require("connect-redis").default;

  const redis = new Redis({
    host: "redis-13424.c12.us-east-1-4.ec2.redns.redis-cloud.com",
    port: 13424,
    password: "iCMEK3gA8r0apTu9oh5neCAah0xrWswf",
  });

  // app.set("trust proxy", 1);
  // app.set("Access-Control-Allow-Credentials", true);

  // app.use(
  //   session({
  //     name: COOKIE_NAME,
  //     store: new RedisStore({
  //       client: redis,
  //       disableTTL: true,
  //       disableTouch: true,
  //     }),
  //     cookie: {
  //       maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
  //       httpOnly: true,
  //       sameSite: "none",
  //       secure: true,
  //     },
  //     saveUninitialized: false,
  //     secret: "pass",
  //     resave: false,
  //   })
  // );

  app.set("trust proxy", 1);
  app.set("Access-Control-Allow-Credentials", true);

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTTL: true,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      },
      saveUninitialized: false,
      secret: "pass",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        ComprehensiveResolver,
        ServiceResolver,
        AuxiliaryResolver,
        DiagnosticResolver,
        DiaryResolver,
        DiseaseResolver,
        HistoryResolver,
        PatientResolver,
        TreatmentResolver,
        VitalResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app: app as any,
    cors: {
      credentials: true,
      origin: "http://localhost:3000",
      // origin: "https://studio.apollographql.com",
    },
  });

  reniecRoute(app);
  sunatRoute(app);

  app.listen(8080, () => {
    console.log("On Servening... http://localhost:8080/graphql");
  });
};

main().catch((e) => console.log(e));
