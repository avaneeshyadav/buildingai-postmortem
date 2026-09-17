import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not configured');
    redis = new Redis({ url, token });
  }
  return redis;
}

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export type AccessRequest = {
  id: string;
  name: string;
  email: string;
  usecase: string;
  status: RequestStatus;
  createdAt: string;
};

const INDEX_KEY = 'requests:index';

export async function saveRequest(req: AccessRequest): Promise<void> {
  const r = getRedis();
  await Promise.all([
    r.set(`request:${req.id}`, JSON.stringify(req)),
    r.lpush(INDEX_KEY, req.id),
  ]);
}

export async function getRequest(id: string): Promise<AccessRequest | null> {
  const raw = await getRedis().get<string>(`request:${id}`);
  if (!raw) return null;
  return typeof raw === 'string' ? JSON.parse(raw) : raw as AccessRequest;
}

export async function listRequests(): Promise<AccessRequest[]> {
  const r = getRedis();
  const ids = await r.lrange<string>(INDEX_KEY, 0, -1);
  if (!ids.length) return [];
  const items = await Promise.all(ids.map((id) => getRequest(id)));
  return items.filter((x): x is AccessRequest => x !== null);
}

export async function updateRequest(id: string, patch: Partial<AccessRequest>): Promise<void> {
  const existing = await getRequest(id);
  if (!existing) return;
  await getRedis().set(`request:${id}`, JSON.stringify({ ...existing, ...patch }));
}
