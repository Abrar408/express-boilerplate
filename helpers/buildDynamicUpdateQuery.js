const buildDynamicUpdateQuery = (table, data) => {
    
    const cols = Object.keys(data)
      .filter(key => data[key] !== null && data[key] != "" && data[key] !== undefined)
      .map(key => `${key} = ?`);
      
    const values = Object.values(data)
      .filter(key => key !== null && key != "" && key !== undefined);
      
    const query = `UPDATE ${table} SET ${cols.join(', ')} WHERE id = ?`;
    return {query,values};
  }

  module.exports = buildDynamicUpdateQuery;