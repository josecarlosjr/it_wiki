import type { Metadata } from 'next';
import { ApiPageContent } from '@/components/api-page-content';

export const metadata: Metadata = {
  title: 'APIs: arquitetura, performance e segurança',
  description: 'Guia visual de REST, SOAP, GraphQL, gRPC, WebSocket, Webhook, MQTT, AMQP, métodos HTTP, performance e segurança de APIs.',
};

export default function ApiPage() {
  return <ApiPageContent />;
}
