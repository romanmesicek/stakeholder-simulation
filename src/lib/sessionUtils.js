// Generate random 6-character alphanumeric code
export function generateSessionCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing: I,O,0,1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Find group with fewest participants
export function assignToGroup(activeGroups, participants, maxPerGroup) {
  // Count participants per group
  const counts = {};
  activeGroups.forEach(g => counts[g] = 0);
  participants.forEach(p => {
    if (counts[p.stakeholder_group] !== undefined) {
      counts[p.stakeholder_group]++;
    }
  });

  // Find groups with minimum count that aren't full
  const availableGroups = activeGroups.filter(g => counts[g] < maxPerGroup);

  if (availableGroups.length === 0) {
    return null; // All groups full
  }

  const minCount = Math.min(...availableGroups.map(g => counts[g]));
  const candidates = availableGroups.filter(g => counts[g] === minCount);

  // Random selection among tied groups
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// Get participant counts per group
export function getGroupCounts(activeGroups, participants) {
  const counts = {};
  activeGroups.forEach(g => counts[g] = 0);
  participants.forEach(p => {
    if (counts[p.stakeholder_group] !== undefined) {
      counts[p.stakeholder_group]++;
    }
  });
  return counts;
}
