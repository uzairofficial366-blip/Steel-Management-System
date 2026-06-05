import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../providers/base_list_provider.dart';
import '../constants/app_colors.dart';
import 'empty_view.dart';
import 'iron_card.dart';
import 'loading_view.dart';

class ModuleListScreen<T, P extends BaseListProvider<T>>
    extends StatefulWidget {
  const ModuleListScreen({
    super.key,
    required this.title,
    required this.searchHint,
    required this.matches,
    required this.titleOf,
    required this.subtitleOf,
    this.trailing,
    this.addRoute,
    this.editRoute,
    this.idOf,
    this.canAdd = true,
    this.canEdit = true,
    this.canDelete = true,
    this.onTapRoute,
  });

  final String title;
  final String searchHint;
  final bool Function(T item, String query) matches;
  final String Function(T item) titleOf;
  final String Function(T item) subtitleOf;
  final Widget Function(T item)? trailing;
  final String? addRoute;
  final String Function(T item)? editRoute;
  final String Function(T item)? onTapRoute;
  final String Function(T item)? idOf;
  final bool canAdd;
  final bool canEdit;
  final bool canDelete;

  @override
  State<ModuleListScreen<T, P>> createState() => _ModuleListScreenState<T, P>();
}

class _ModuleListScreenState<T, P extends BaseListProvider<T>>
    extends State<ModuleListScreen<T, P>> {
  String query = '';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback(
      (_) => context.read<P>().fetch(),
    );
  }

  Future<void> _confirmDelete(P provider, T item) async {
    final id = widget.idOf?.call(item);
    if (id == null) return;
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete item?'),
        content: Text('This will remove ${widget.titleOf(item)}.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    if (ok == true && mounted) {
      final deleted = await provider.delete(id);
      if (!deleted && mounted) {
        _showError(provider.error);
      }
    }
  }

  void _showError(String? message) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message ?? 'Request failed')));
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<P>();
    final filtered = provider.items
        .where((item) => widget.matches(item, query.toLowerCase()))
        .toList();
    return Scaffold(
      appBar: AppBar(title: Text(widget.title)),
      floatingActionButton: widget.canAdd && widget.addRoute != null
          ? FloatingActionButton(
              onPressed: () => context.push(widget.addRoute!),
              child: const Icon(Icons.add),
            )
          : null,
      body: RefreshIndicator(
        onRefresh: provider.fetch,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextField(
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.search),
                hintText: widget.searchHint,
              ),
              onChanged: (value) => setState(() => query = value),
            ),
            const SizedBox(height: 14),
            if (provider.error != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Text(
                  provider.error!,
                  style: const TextStyle(color: AppColors.danger),
                ),
              ),
            if (provider.loading)
              const SizedBox(height: 300, child: LoadingView())
            else if (filtered.isEmpty)
              const SizedBox(
                height: 300,
                child: EmptyView(message: 'No records found'),
              )
            else
              ...filtered.map(
                (item) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: IronCard(
                    onTap: widget.onTapRoute == null
                        ? null
                        : () => context.push(widget.onTapRoute!(item)),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                widget.titleOf(item),
                                style: Theme.of(context).textTheme.titleMedium
                                    ?.copyWith(fontWeight: FontWeight.w800),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                widget.subtitleOf(item),
                                style: const TextStyle(
                                  color: AppColors.textMuted,
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (widget.trailing != null) widget.trailing!(item),
                        PopupMenuButton<String>(
                          onSelected: (value) {
                            if (value == 'edit') {
                              context.push(widget.editRoute!(item));
                            }
                            if (value == 'delete') {
                              _confirmDelete(provider, item);
                            }
                          },
                          itemBuilder: (context) => [
                            if (widget.canEdit && widget.editRoute != null)
                              const PopupMenuItem(
                                value: 'edit',
                                child: Text('Edit'),
                              ),
                            if (widget.canDelete && widget.idOf != null)
                              const PopupMenuItem(
                                value: 'delete',
                                child: Text('Delete'),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
