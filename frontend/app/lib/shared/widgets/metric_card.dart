import 'package:flutter/material.dart';

import 'glass_card.dart';

class MetricCard extends StatelessWidget {
  const MetricCard({
    super.key,
    required this.label,
    required this.value,
    required this.helper,
    this.icon = Icons.auto_graph,
  });

  final String label;
  final String value;
  final String helper;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: Theme.of(context).colorScheme.secondary),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  label,
                  style: Theme.of(context).textTheme.labelLarge?.copyWith(
                        color: Colors.white70,
                      ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            value,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
          ),
          const SizedBox(height: 8),
          Text(
            helper,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Colors.white60,
                ),
          ),
        ],
      ),
    );
  }
}
