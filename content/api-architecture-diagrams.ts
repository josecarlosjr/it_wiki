import type { DiagramSpec } from './diagrams';

export type ApiArchitectureKey = 'rest' | 'soap' | 'graphql' | 'grpc' | 'websocket' | 'webhook' | 'mqtt' | 'amqp';

const http = { label: 'RFC 9110 — HTTP Semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110' };
const websocket = { label: 'RFC 6455 — WebSocket', url: 'https://www.rfc-editor.org/rfc/rfc6455' };
const grpc = { label: 'gRPC — Introduction', url: 'https://grpc.io/docs/what-is-grpc/introduction/' };
const graphql = { label: 'GraphQL Specification', url: 'https://spec.graphql.org/' };
const mqtt = { label: 'OASIS MQTT 5.0', url: 'https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html' };
const amqp = { label: 'OASIS AMQP 1.0', url: 'https://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-overview-v1.0-os.html' };
const soap = { label: 'W3C SOAP 1.2', url: 'https://www.w3.org/TR/soap12-part1/' };

const diagrams: Record<ApiArchitectureKey, DiagramSpec> = {
  rest: { title: 'RESTful API: recurso, método e representação', description: 'REST normalmente usa HTTP para operar recursos por URI. O método comunica a intenção; status codes e representações comunicam o resultado.', width: 980, height: 410, nodes: [
    { id:'c',label:'1. Cliente\nGET /orders/42',x:40,y:150,kind:'client' }, { id:'api',label:'2. REST API\nvalida + autoriza',x:300,y:150,kind:'control' }, { id:'svc',label:'3. Serviço\nregra de negócio',x:555,y:150,kind:'workload' }, { id:'db',label:'4. Data Store',x:790,y:150,kind:'data' }, { id:'r',label:'5. HTTP 200\nJSON + headers',x:300,y:300,kind:'network' },
  ], edges:[{from:'c',to:'api',label:'1 request'},{from:'api',to:'svc',label:'2 dispatch'},{from:'svc',to:'db',label:'3 read/write'},{from:'db',to:'svc',label:'4 result'},{from:'svc',to:'r',label:'5 representation'},{from:'r',to:'c',label:'6 response'}], sources:[http] },
  soap: { title:'SOAP: envelope XML + contrato WSDL', description:'SOAP usa mensagens XML estruturadas em Envelope/Header/Body e pode ser descrito por WSDL.', width:980,height:410,nodes:[
    {id:'c',label:'1. SOAP Client',x:40,y:150,kind:'client'},{id:'env',label:'2. XML Envelope\nHeader + Body',x:280,y:150,kind:'network'},{id:'svc',label:'3. SOAP Endpoint\ncontrato WSDL',x:535,y:150,kind:'control'},{id:'logic',label:'4. Business Service',x:780,y:150,kind:'workload'},{id:'resp',label:'5. SOAP Response\nou Fault',x:535,y:300,kind:'network'},
  ],edges:[{from:'c',to:'env',label:'1 build message'},{from:'env',to:'svc',label:'2 send'},{from:'svc',to:'logic',label:'3 invoke operation'},{from:'logic',to:'resp',label:'4 result/fault'},{from:'resp',to:'c',label:'5 XML response'}],sources:[soap]},
  graphql:{title:'GraphQL: cliente escolhe os campos',description:'O cliente envia uma query declarando exatamente os campos necessários. O servidor valida, executa resolvers e monta a resposta solicitada.',width:980,height:410,nodes:[
    {id:'c',label:'1. Cliente\nquery { user { name } }',x:30,y:150,kind:'client'},{id:'g',label:'2. GraphQL Endpoint\nparse + validate',x:290,y:150,kind:'control'},{id:'r',label:'3. Resolvers',x:550,y:150,kind:'workload'},{id:'d',label:'4. APIs / DBs',x:790,y:150,kind:'data'},{id:'o',label:'5. JSON\nshape da query',x:290,y:300,kind:'network'},
  ],edges:[{from:'c',to:'g',label:'1 query'},{from:'g',to:'r',label:'2 execution plan'},{from:'r',to:'d',label:'3 fetch'},{from:'d',to:'r',label:'4 data'},{from:'r',to:'o',label:'5 compose'},{from:'o',to:'c',label:'6 response'}],sources:[graphql]},
  grpc:{title:'gRPC: contrato .proto e chamadas RPC',description:'gRPC define serviços e mensagens em Protocol Buffers. HTTP/2 permite multiplexing e streaming.',width:980,height:410,nodes:[
    {id:'proto',label:'1. .proto\nService + Messages',x:45,y:65,kind:'data'},{id:'stub',label:'2. Client Stub',x:45,y:220,kind:'client'},{id:'h2',label:'3. HTTP/2\nProtobuf frames',x:335,y:220,kind:'network'},{id:'server',label:'4. gRPC Server',x:620,y:220,kind:'control'},{id:'impl',label:'5. Service Impl',x:830,y:220,kind:'workload'},
  ],edges:[{from:'proto',to:'stub',label:'1 generate'},{from:'stub',to:'h2',label:'2 typed call'},{from:'h2',to:'server',label:'3 multiplex/stream'},{from:'server',to:'impl',label:'4 invoke'},{from:'impl',to:'server',label:'5 result'},{from:'server',to:'stub',label:'6 typed response'}],sources:[grpc]},
  websocket:{title:'WebSocket: conexão persistente bidirecional',description:'Após o opening handshake, cliente e servidor mantêm uma conexão persistente para enviar mensagens nos dois sentidos.',width:980,height:410,nodes:[
    {id:'c',label:'1. Browser / Client',x:50,y:160,kind:'client'},{id:'h',label:'2. HTTP Upgrade\n101 Switching Protocols',x:310,y:75,kind:'network'},{id:'ws',label:'3. WebSocket Server',x:640,y:160,kind:'control'},{id:'flow',label:'4. Full-duplex frames\nclient ↔ server',x:310,y:285,kind:'network'},
  ],edges:[{from:'c',to:'h',label:'1 handshake'},{from:'h',to:'ws',label:'2 upgrade accepted'},{from:'c',to:'flow',label:'3 send frames',bidirectional:true},{from:'flow',to:'ws',label:'4 persistent channel',bidirectional:true}],sources:[websocket]},
  webhook:{title:'Webhook: callback HTTP orientado a evento',description:'Em vez de polling, o produtor chama uma URL registrada quando um evento acontece.',width:980,height:410,nodes:[
    {id:'sub',label:'1. Consumer registra\ncallback URL',x:45,y:70,kind:'client'},{id:'producer',label:'2. Producer / SaaS',x:345,y:70,kind:'control'},{id:'event',label:'3. Evento acontece',x:345,y:220,kind:'decision'},{id:'hook',label:'4. POST webhook\nassinatura + event ID',x:645,y:220,kind:'network'},{id:'worker',label:'5. Queue / Worker\nidempotente',x:645,y:340,kind:'workload'},
  ],edges:[{from:'sub',to:'producer',label:'1 subscribe'},{from:'producer',to:'event',label:'2 detect event'},{from:'event',to:'hook',label:'3 callback'},{from:'hook',to:'worker',label:'4 ACK rápido + async'}],sources:[http]},
  mqtt:{title:'MQTT: publish/subscribe via broker',description:'Publishers enviam mensagens para tópicos; o broker encaminha para subscribers interessados. QoS define garantias de entrega.',width:980,height:410,nodes:[
    {id:'p',label:'1. Publisher\nsensor/device',x:40,y:160,kind:'client'},{id:'b',label:'2. MQTT Broker\ntopics + QoS',x:360,y:160,kind:'control'},{id:'s1',label:'3. Subscriber A',x:735,y:80,kind:'workload'},{id:'s2',label:'4. Subscriber B',x:735,y:245,kind:'workload'},
  ],edges:[{from:'p',to:'b',label:'1 PUBLISH topic'},{from:'s1',to:'b',label:'2 SUBSCRIBE'},{from:'s2',to:'b',label:'2 SUBSCRIBE'},{from:'b',to:'s1',label:'3 deliver'},{from:'b',to:'s2',label:'4 deliver'}],sources:[mqtt]},
  amqp:{title:'AMQP: producer → router → queue → consumer',description:'AMQP é um protocolo de messaging interoperável. Brokers usam filas e roteamento para desacoplar produtores e consumidores.',width:980,height:410,nodes:[
    {id:'p',label:'1. Producer',x:35,y:160,kind:'client'},{id:'e',label:'2. Router / Exchange',x:275,y:160,kind:'control'},{id:'q',label:'3. Queue\nbuffer + ack',x:535,y:160,kind:'data'},{id:'c',label:'4. Consumer',x:790,y:160,kind:'workload'},{id:'dlq',label:'5. DLQ / retry',x:535,y:315,kind:'data'},
  ],edges:[{from:'p',to:'e',label:'1 publish'},{from:'e',to:'q',label:'2 route'},{from:'q',to:'c',label:'3 deliver'},{from:'c',to:'q',label:'4 ack/nack',bidirectional:true},{from:'q',to:'dlq',label:'5 failure policy'}],sources:[amqp]},
};

export function getApiArchitectureDiagram(key: ApiArchitectureKey): DiagramSpec { return diagrams[key]; }
