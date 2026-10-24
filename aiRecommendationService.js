// Mock AI service for MVP.
// Replace the body of this function with a real LLM/API call later.
export function generateHamperRecommendation(prompt, products) {
  const text = prompt.toLowerCase();
  let ids = text.includes("corporate") ? [15,17,9,6] :
    text.includes("anniversary") || text.includes("wife") || text.includes("romantic") ? [4,9,11,6] :
    text.includes("self") ? [2,10,16,6] : [1,2,3,6];
  const items = ids.map(id => products.find(p => p.id === id)).filter(Boolean);
  return {items, total: items.reduce((sum,p)=>sum+p.price,0)};
}