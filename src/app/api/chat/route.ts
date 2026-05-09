import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import prisma from '@/lib/prisma'; // In a real app we would use this to fetch data

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
    system: `You are Flow AI, a highly advanced, futuristic business operations assistant. 
Your primary function is to help users analyze their business performance, manage inventory, and understand sales insights.
You speak with a professional, slightly sci-fi, and highly capable tone. You are concise but informative.
When asked about sales or inventory, use the provided tools to query the system.
If you don't know the exact answer, make reasonable AI-driven recommendations based on general SaaS/e-commerce knowledge.`,
    tools: {
      getInventoryAlerts: (tool as any)({
        description: 'Get a list of products that are low on stock or out of stock',
        parameters: z.object({}),
        execute: async () => {
          // In a real app: await prisma.inventory.findMany({ where: { quantity: { lte: 10 } }, include: { product: true } })
          return [
            { sku: 'SKU-992', name: 'Quantum CPU Accelerator', stock: 12, status: 'Low Stock' },
            { sku: 'SKU-544', name: 'Gravity Emitter Module', stock: 5, status: 'Low Stock' },
            { sku: 'SKU-231', name: 'Neural Link Cable', stock: 0, status: 'Out of Stock' },
          ];
        },
      }),
      getSalesInsights: (tool as any)({
        description: 'Get an analysis of recent sales and revenue drops',
        parameters: z.object({
          period: z.string().describe('The time period to analyze, e.g., "last week", "this month"'),
        }),
        execute: async ({ period }: { period: string }) => {
          return {
            period,
            insight: `Sales dropped 15% during ${period} primarily due to the Out-of-Stock status of the Neural Link Cable and decreased marketing spend on Social channels.`,
            recommendation: 'Restock SKU-231 immediately and increase Facebook Ad spend by 20%.'
          };
        },
      }),
      predictDemand: (tool as any)({
        description: 'Predict the demand for a specific product or general inventory for the next period',
        parameters: z.object({
          productName: z.string().optional().describe('Optional product name to predict demand for'),
        }),
        execute: async ({ productName }: { productName?: string }) => {
          if (productName) {
            return { product: productName, prediction: 'High demand expected (+35%) due to upcoming seasonal trends. Recommended restock: 200 units.' };
          }
          return { prediction: 'Overall demand is projected to increase by 12% next week. Ensure top 5 performing SKUs have at least 30 days of buffer stock.' };
        },
      })
    } as any,
  });

  return (result as any).toDataStreamResponse ? (result as any).toDataStreamResponse() : (result as any).toTextStreamResponse();
}
